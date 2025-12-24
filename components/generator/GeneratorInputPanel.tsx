import React from 'react';
import { Check, FileText, Sparkles, Loader2, Cpu, Zap } from 'lucide-react';
import { Aircraft } from '../../types';

interface Props {
  aircraftList: Aircraft[];
  selectedAircraftIds: string[];
  toggleAircraftSelection: (id: string) => void;
  userInput: string;
  setUserInput: (v: string) => void;
  isGenerating: boolean;
  handleGenerate: () => void;
}

const GeneratorInputPanel: React.FC<Props> = ({ 
  aircraftList, 
  selectedAircraftIds, 
  toggleAircraftSelection,
  userInput,
  setUserInput,
  isGenerating,
  handleGenerate
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-blue-500/5 border border-white/60 relative overflow-hidden flex flex-col h-auto lg:h-full">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        {/* Aircraft Selection Grid */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>选择测试对象 (可选)</span>
            {selectedAircraftIds.length > 0 && (
              <button 
                onClick={() => selectedAircraftIds.forEach(id => toggleAircraftSelection(id))} 
                /* Note: In parent we should probably pass a clear function, but re-toggling all clears them if logic holds, or better yet, pass specific clear function. 
                   For exact modularity based on previous logic: 
                */
                className="text-[10px] text-blue-600 hover:text-blue-700 font-medium"
              >
                已选 ({selectedAircraftIds.length})
              </button>
            )}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
            {aircraftList.map(aircraft => {
              const isSelected = selectedAircraftIds.includes(aircraft.id);
              return (
                <button
                  key={aircraft.id}
                  onClick={() => toggleAircraftSelection(aircraft.id)}
                  className={`relative p-2 rounded-lg border text-left transition-all text-xs ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  <div className="font-bold truncate">{aircraft.code}</div>
                  <div className="text-[10px] opacity-70 truncate">{aircraft.model}</div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                      <Check size={8} strokeWidth={4} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-2">
          <h2 className="text-lg font-bold text-slate-800 flex items-center mb-1">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-blue-600 mr-3 border border-blue-100">
              <FileText size={18} />
            </div>
            测试场景定义
          </h2>
          <p className="text-xs text-slate-500 ml-12">
            请输入自然语言指令，系统将自动转化为测试用例。
          </p>
        </div>
        
        <div className="relative flex-1 min-h-[150px]">
          <textarea
            className="w-full h-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-sm text-slate-700 placeholder-slate-400 font-medium transition-all shadow-inner"
            placeholder="例如：对选中的飞机进行一级战斗准备，同时安排快速加油，要求在 30 分钟内完成..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <div className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 flex items-center">
              <Sparkles size={10} className="mr-1" />
              AI POWERED
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !userInput.trim()}
          className="w-full mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-4 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform active:scale-[0.98] font-semibold tracking-wide group overflow-hidden relative"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              <span className="animate-pulse">正在运算...</span>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Cpu className="mr-2" size={18} />
              生成测试用例
            </>
          )}
        </button>
        
        {/* Quick Tip */}
        <div className="mt-4 bg-amber-50/50 border border-amber-100 p-3 rounded-lg text-[10px] text-amber-700/80 flex items-start space-x-2">
          <Zap size={12} className="mt-0.5 shrink-0" />
          <p>提示：点击上方列表快速选中飞机，结合文字描述可提高生成准确度。</p>
        </div>
    </div>
  );
};

export default GeneratorInputPanel;