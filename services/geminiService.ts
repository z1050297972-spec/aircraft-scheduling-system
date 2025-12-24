import { GoogleGenAI, Type } from "@google/genai";
import { Aircraft, GeneratedScenario } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTestCase = async (
  userInput: string,
  aircraftList: Aircraft[]
): Promise<GeneratedScenario | null> => {
  try {
    const aircraftContext = aircraftList.map(a => ({
      id: a.code,
      model: a.model,
      status: a.status,
      fuel: a.consumables.fuelLevel,
      health: a.health
    }));

    const prompt = `
      As an expert Aircraft Dispatch Test System, generate a realistic test scenario based on the user request and current aircraft status.
      
      User Request: "${userInput}"
      
      IMPORTANT INSTRUCTION:
      If the User Request contains explicit fields like "【指定场景名称】" (Specified Scenario Name) or "【指定包含标签】" (Specified Tags), you MUST use those exact values in the generated JSON response for 'scenarioName' and include those tags in your logic.
      
      Current Aircraft Status:
      ${JSON.stringify(aircraftContext, null, 2)}
      
      Generate a detailed plan including specific tasks for each relevant aircraft, simulate the execution outcome (score, time, logs), and resource usage.
      The score should reflect how well the system would handle this scenario (90+ for simple valid requests, lower if resources are tight or aircraft are broken).
      Language: Chinese (Simplified).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarioName: { type: Type.STRING, description: "A short name for the scenario. Use user provided name if available." },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  aircraftId: { type: Type.STRING, description: "The aircraft code" },
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  requiredResources: { type: Type.STRING },
                  estimatedDuration: { type: Type.NUMBER, description: "Minutes" }
                }
              }
            },
            predictedOutcome: {
              type: Type.OBJECT,
              properties: {
                isComplete: { type: Type.BOOLEAN },
                totalTime: { type: Type.NUMBER },
                score: { type: Type.NUMBER },
                grade: { type: Type.STRING, enum: ['优秀', '良好', '合格', '不合格'] },
                logs: { type: Type.ARRAY, items: { type: Type.STRING } },
                resourceUsage: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.NUMBER }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as GeneratedScenario;

  } catch (error) {
    console.error("Gemini generation error:", error);
    return null;
  }
};

// New function to optimize raw user requirements
export const optimizeScenarioDescription = async (rawInput: string): Promise<string> => {
  try {
    const prompt = `
      You are a specialized assistant for an Aircraft Dispatch System.
      Your goal is to refine vague user requirements into professional, structured test scenario descriptions.
      
      Input: "${rawInput}"
      
      Instructions:
      1. Use professional aviation/military terminology.
      2. Make the requirement specific (e.g., instead of "fix the plane", use "perform Level 2 maintenance and hydraulic check").
      3. Keep it concise but descriptive.
      4. Language: Chinese (Simplified).
      5. Output ONLY the refined text string.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || rawInput;
  } catch (error) {
    console.error("Optimization error:", error);
    return rawInput;
  }
};