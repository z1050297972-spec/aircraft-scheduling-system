import React from 'react';
import { FolderOpen, Plus, Search, Filter } from 'lucide-react';

interface Props {
  onOpenCreateModal: () => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}

const LibraryHeader: React.FC<Props> = ({ onOpenCreateModal, searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg shadow-blue-500/5 border border-white/60 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Decor */}
      <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>

      <div className="relative z-10 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center whitespace-nowrap">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-3 border border-blue-100">
            <FolderOpen size={24} />
          </div>
          测试用例库
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-lg ml-1 hidden md:block">
          集中管理已生成的仿真方案。点击卡片可直接编辑用例信息，支持一键加载复用。
        </p>
      </div>

      <div className="w-full md:w-auto flex items-center space-x-3 relative z-10">
        {/* Add Button */}
        <button
          onClick={onOpenCreateModal}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 flex items-center transition-all active:scale-95"
        >
          <Plus size={20} className="mr-2" />
          <span className="font-bold text-sm">新建需求</span>
        </button>

        <div className="relative group w-full md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="搜索场景..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium shadow-sm group-hover:bg-white"
          />
        </div>
        <button className="p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200 hover:border-blue-200 transition-all shadow-sm active:scale-95">
          <Filter size={20} />
        </button>
      </div>
    </div>
  );
};

export default LibraryHeader;