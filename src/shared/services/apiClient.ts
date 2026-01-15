/**
 * API Client - Base configuration for API calls
 *
 * TODO: 后续接入自研大模型后端时，在此配置 API 基础设置
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Base API configuration
 */
export const API_CONFIG = {
  baseUrl: (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
};

/**
 * Generic API request wrapper
 * TODO: 实现实际的 API 调用逻辑
 */
export const apiRequest = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json() as T;
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
};
