import React from 'react';
import { Calendar, Tag, Hash, Clock, Trash2, Play } from 'lucide-react';
import { SavedTestCase } from '../../types';

interface Props {
  testCase: SavedTestCase;
  idx: number;
  onOpenEditModal: (t: SavedTestCase) => void;
  onDelete: (id: string) => void;
  onLoad: (t: SavedTestCase) => void;
}

const CaseCard: React.FC<Props> = ({ testCase, idx, onOpenEditModal, onDelete, onLoad }) => {
  return (
    <div 
      onClick={() => onOpenEditModal(testCase)}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards cursor-pointer"
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      {/* Hover Edit Hint */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-500 shadow-sm border border-slate-100 pointer-events-none">
          点击编辑
      </div>

      {/* Top Gradient Line based on Score */}
      <div className={`h-1 w-full bg-gradient-to-r ${
        testCase.predictedOutcome.score >= 90 ? 'from-emerald-400 to-emerald-600' :
        testCase.predictedOutcome.score >= 80 ? 'from-blue-400 to-blue-600' :
        'from-orange-400 to-orange-600'
      }`}></div>

      <div className="p-6 pb-4 border-b border-slate-50 relative">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 mr-2">
            <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors text-lg" title={testCase.scenarioName}>
              {testCase.scenarioName}
            </h3>
          </div>
          <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
              testCase.predictedOutcome.grade === '优秀' ? 'bg-emerald-50 text-emerald-700' :
              testCase.predictedOutcome.grade === '良好' ? 'bg-blue-50 text-blue-700' :
              'bg-orange-50 text-orange-700'
          }`}>
            <span className="text-[10px] font-bold uppercase leading-none mb-0.5">{testCase.predictedOutcome.grade}</span>
            <span className="text-xs font-black">{testCase.predictedOutcome.score}</span>
          </div>
        </div>
        
        <div className="flex items-center text-xs text-slate-400 mb-4 font-mono bg-slate-50 inline-block px-2 py-1 rounded">
          <Calendar size={12} className="mr-1.5 inline" />
          {testCase.createdAt}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {testCase.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="flex items-center text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200 font-medium group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Tag size={10} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Body */}
      <div className="p-6 flex-1 bg-slate-50/30">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm group-hover:border-blue-100 transition-colors">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center"><Hash size={10} className="mr-1"/> 任务数</div>
            <div className="text-sm font-mono font-bold text-slate-700">{testCase.tasks.length}</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm group-hover:border-blue-100 transition-colors">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center"><Clock size={10} className="mr-1"/> 耗时</div>
            <div className="text-sm font-mono font-bold text-slate-700">{testCase.predictedOutcome.totalTime}m</div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 pt-0 bg-slate-50/30">
        <div className="flex gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(testCase.id); }}
            className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-red-100"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onLoad(testCase); }}
            className="flex-[3] flex items-center justify-center py-2.5 text-xs font-bold bg-white text-blue-600 border border-slate-200 hover:border-blue-300 hover:shadow-md hover:text-blue-700 rounded-xl transition-all shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
          >
            <Play size={14} className="mr-2 fill-current" />
            加载场景
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;