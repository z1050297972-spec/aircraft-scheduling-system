import React, { useEffect, useState } from 'react';
import { BarChart3, Loader2, Timer, CheckCircle2, Save, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GeneratedScenario } from '../../../types';

interface Props {
  scenario: GeneratedScenario | null;
  isGenerating: boolean;
  loadingStep: number;
  loadingTexts: string[];
  onSave?: (scenario: GeneratedScenario) => void;
  hasSaved: boolean;
  handleSaveClick: () => void;
}

const GeneratorResultPanel: React.FC<Props> = ({
  scenario,
  isGenerating,
  loadingStep,
  loadingTexts,
  onSave,
  hasSaved,
  handleSaveClick
}) => {
  const isPresetScenario = scenario?.scenarioType === 'preset-refuel';
  const [executionPhase, setExecutionPhase] = useState(0);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  useEffect(() => {
    if (!scenario || !isPresetScenario || isGenerating) {
      setExecutionPhase(0);
      setHasAutoSaved(false); // Reset auto-save state when starting new generation
      return;
    }

    setExecutionPhase(0);
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    timers.push(setTimeout(() => setExecutionPhase(1), 900));
    timers.push(setTimeout(() => setExecutionPhase(2), 2100));
    timers.push(setTimeout(() => setExecutionPhase(3), 3600));

    return () => timers.forEach(clearTimeout);
  }, [scenario, isPresetScenario, isGenerating]);

  // Auto-save when progress reaches 100%
  useEffect(() => {
    if (isPresetScenario && executionPhase >= 3 && !hasSaved && !hasAutoSaved && onSave) {
      setHasAutoSaved(true);
      handleSaveClick();
    }
  }, [executionPhase, isPresetScenario, hasSaved, hasAutoSaved, onSave, handleSaveClick]);

  const executionSteps = [
    { label: '测试用例下发', detail: '保障组已接收任务' },
    { label: '测试开始', detail: '加油保障作业执行中' },
    { label: '测试报表已生成', detail: '报告已归档可查' }
  ];

  const progressPercent = !isPresetScenario
    ? 0
    : executionPhase >= 3
      ? 100
      : executionPhase === 2
        ? 82
        : executionPhase === 1
          ? 55
          : 30;

  const isReportReady = isPresetScenario && executionPhase >= 3;

  return (
    <div className="bg-white/80 backdrop-blur-xl p-4 md:p-8 rounded-2xl shadow-lg shadow-blue-500/5 border border-white/60 min-h-[400px] lg:min-h-[600px] flex flex-col relative overflow-hidden animate-in slide-in-from-right-4 duration-500">
      {/* Background Grid for Tech Feel */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

      {!scenario && !isGenerating && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 z-10 animate-float">
          <div className="w-32 h-32 bg-gradient-to-br from-slate-50 to-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-500/5 border border-slate-100 relative">
            <div className="absolute inset-0 rounded-full border border-blue-100 opacity-50 animate-pulse"></div>
            <BarChart3 size={48} className="text-slate-300" />
          </div>
          <p className="text-lg font-medium text-slate-500">等待任务指令输入...</p>
          <div className="flex items-center mt-3 text-xs text-slate-400 space-x-2 font-mono">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>SYSTEM READY</span>
            <span>|</span>
            <span>WAITING FOR DATA</span>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="flex-1 flex flex-col items-center justify-center z-10">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-blue-400/10 rounded-full animate-pulse delay-75"></div>
            <div className="bg-white p-6 rounded-full shadow-2xl shadow-blue-500/20 relative z-10 border border-blue-50">
              <Loader2 size={48} className="animate-spin text-blue-600" />
            </div>
          </div>

          <div className="h-8 overflow-hidden relative w-full text-center">
            {loadingTexts.map((text, idx) => (
              <p
                key={idx}
                className={`absolute w-full text-base md:text-lg font-bold text-slate-700 transition-all duration-500 transform ${idx === loadingStep ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                  }`}
              >
                {text}
              </p>
            ))}
          </div>
          <div className="w-64 h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-progress" style={{ width: '90%', animationDuration: '6s' }}></div>
          </div>
        </div>
      )}

      {scenario && (
        <div className="z-10 h-full flex flex-col space-y-6">

          {/* Report Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight break-all">{scenario.scenarioName}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm shrink-0 ${scenario.predictedOutcome.grade === '优秀' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                  scenario.predictedOutcome.grade === '良好' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                    'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}>
                  {scenario.predictedOutcome.grade}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-100"><Timer size={14} className="mr-2 text-blue-500" /> 预计耗时: <strong className="ml-1 text-slate-700 font-mono">{scenario.predictedOutcome.totalTime}</strong> min</span>
                <span className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-100"><CheckCircle2 size={14} className="mr-2 text-emerald-500" /> 综合评分: <strong className="ml-1 text-slate-700 font-mono">{scenario.predictedOutcome.score}</strong></span>
              </div>
            </div>

            <div className="mt-2 md:mt-0 w-full md:w-auto">
              {onSave && (
                <button
                  onClick={handleSaveClick}
                  disabled={hasSaved}
                  className={`flex items-center justify-center w-full md:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 ${hasSaved
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default'
                    : 'bg-white text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                >
                  {hasSaved ? <Check size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
                  {hasSaved ? '已归档' : '保存用例'}
                </button>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">

            {/* Left Col: Tasks */}
            <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500 delay-100 min-h-[300px]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                {isPresetScenario ? '测试用例列表 (Test Case List)' : '执行序列 (Execution Sequence)'}
              </h4>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {scenario.tasks.map((task, idx) => (
                  <div key={idx} className="group flex items-start p-4 bg-white/50 hover:bg-white rounded-xl border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 font-mono font-bold text-xs flex items-center justify-center mr-4 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors shrink-0">
                      {(idx + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{task.type}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{task.aircraftId}</span>
                      </div>
                      <p className={`text-xs text-slate-500 leading-relaxed mb-2 ${isPresetScenario ? '' : 'line-clamp-2'}`}>
                        {task.description}
                      </p>
                      <div className="flex items-center text-[10px] text-slate-400 space-x-3 font-medium">
                        <span className="flex items-center"><Timer size={10} className="mr-1" /> {task.estimatedDuration}min</span>
                        <span className="w-px h-2 bg-slate-200"></span>
                        <span>{task.requiredResources}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Stats & Logs */}
            <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
              {isPresetScenario ? (
                <>
                  <div className="bg-white/50 rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10"><Timer size={48} /></div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">测试执行进度</h4>
                    <div className="space-y-3">
                      {executionSteps.map((step, index) => {
                        const isComplete = executionPhase > index;
                        const isActive = executionPhase === index;
                        return (
                          <div
                            key={step.label}
                            className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${isActive
                              ? 'border-blue-200 bg-blue-50/60'
                              : isComplete
                                ? 'border-emerald-200 bg-emerald-50/60'
                                : 'border-slate-100 bg-white/60'
                              }`}
                          >
                            <div className={`mt-0.5 ${isComplete ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                              {isComplete ? (
                                <CheckCircle2 size={16} />
                              ) : isActive ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Timer size={16} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-semibold ${isComplete ? 'text-emerald-700' : isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                                {step.label}
                              </div>
                              <div className="text-xs text-slate-500">{step.detail}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 font-mono">
                        <span>PROGRESS</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`rounded-xl p-5 border shadow-sm flex items-center justify-between ${isReportReady ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-900 border-slate-800'
                      }`}
                  >
                    <div>
                      <div className={`text-sm font-semibold ${isReportReady ? 'text-emerald-700' : 'text-slate-100'}`}>
                        {isReportReady ? '测试报表已生成' : '测试报表生成中'}
                      </div>
                      <div className={`text-xs mt-1 ${isReportReady ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {isReportReady ? '报告已自动归档，可在用例库查看。' : '正在汇总测试数据与资源占用信息...'}
                      </div>
                    </div>
                    {isReportReady ? (
                      <CheckCircle2 size={28} className="text-emerald-500" />
                    ) : (
                      <Loader2 size={24} className="text-blue-400 animate-spin" />
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Chart */}
                  <div className="bg-white/50 rounded-xl border border-slate-100 shadow-sm p-5 flex-1 min-h-[220px] flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10"><BarChart3 size={60} /></div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">资源负载 (Load Analysis)</h4>
                    <div className="flex-1 min-h-0 relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scenario.predictedOutcome.resourceUsage} layout="vertical" margin={{ left: 0, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '8px 12px', background: 'rgba(255,255,255,0.95)' }}
                            cursor={{ fill: '#f8fafc' }}
                          />
                          <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={16}>
                            {scenario.predictedOutcome.resourceUsage.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Terminal Log */}
                  <div className="bg-slate-900 rounded-xl p-4 shadow-2xl shadow-slate-900/10 border border-slate-800 h-48 overflow-hidden flex flex-col relative">
                    <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none"></div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 relative z-10">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                        System Log
                      </h4>
                      <div className="flex space-x-1.5 opacity-50">
                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-1.5 custom-scrollbar relative z-10">
                      {scenario.predictedOutcome.logs.map((log, i) => (
                        <div key={i} className="flex text-slate-300 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                          <span className="text-slate-600 mr-3 w-14 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                          <span className="opacity-90">{log}</span>
                        </div>
                      ))}
                      <div className="text-emerald-400 flex animate-pulse mt-2">
                        <span className="text-slate-600 mr-3 w-14 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                        <span>{">>"} 任务执行完毕 (TASK COMPLETED).</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default GeneratorResultPanel;
