import React from 'react';
import { X, Type, Tag, List, Sparkles, ArrowRight, Edit3, Save } from 'lucide-react';

export const CreateCaseModal = ({
    isOpen,
    onClose,
    newName,
    setNewName,
    newTags,
    setNewTags,
    newRequirement,
    setNewRequirement,
    isOptimizing,
    handleOptimize,
    handleCreate
}: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
               <div>
                  <h3 className="text-xl font-bold text-slate-800">新建测试需求</h3>
                  <p className="text-xs text-slate-500 mt-1">填写字段将直接对应生成的用例卡片信息</p>
               </div>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
              
              {/* Scenario Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Type size={12} className="mr-1.5" />
                  场景名称 (Scenario Name)
                </label>
                <input 
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium placeholder-slate-400 transition-all"
                  placeholder="例如：多机编队紧急加油测试"
                  value={newName}
                  onChange={(e: any) => setNewName(e.target.value)}
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Tag size={12} className="mr-1.5" />
                  标签 (Tags)
                </label>
                <input 
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium placeholder-slate-400 transition-all"
                  placeholder="例如：J-20, 紧急, 燃油 (用逗号分隔)"
                  value={newTags}
                  onChange={(e: any) => setNewTags(e.target.value)}
                />
              </div>

              {/* Requirement Description */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                    <List size={12} className="mr-1.5" />
                    详细需求描述 (Description)
                  </label>
                  <button 
                     onClick={handleOptimize}
                     disabled={isOptimizing || !newRequirement.trim()}
                     className="flex items-center text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                   >
                     {isOptimizing ? <Sparkles size={10} className="mr-1 animate-spin" /> : <Sparkles size={10} className="mr-1" />}
                     {isOptimizing ? '优化中...' : 'AI 润色'}
                   </button>
                </div>
                <textarea 
                  className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-sm text-slate-700 placeholder-slate-400 transition-all"
                  placeholder="描述具体的调度逻辑或故障场景，例如：安排两架 J-20 进行飞行前检查，并发现在加油过程中出现液压油泄露..."
                  value={newRequirement}
                  onChange={(e: any) => setNewRequirement(e.target.value)}
                />
              </div>

            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50 rounded-b-2xl">
               <button 
                 onClick={onClose}
                 className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
               >
                 取消
               </button>
               <button 
                 onClick={handleCreate}
                 disabled={!newRequirement.trim()}
                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:shadow-none flex items-center"
               >
                 前往生成
                 <ArrowRight size={16} className="ml-2" />
               </button>
            </div>
          </div>
        </div>
    );
};

export const EditCaseModal = ({
    editingCase,
    onClose,
    editName,
    setEditName,
    editTags,
    setEditTags,
    handleSaveEdit
}: any) => {
    if (!editingCase) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-200 border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
               <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <Edit3 size={18} className="mr-2 text-blue-600"/>
                    编辑用例信息
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">ID: {editingCase.id}</p>
               </div>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Type size={12} className="mr-1.5" />
                  场景名称 (Scenario Name)
                </label>
                <input 
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium placeholder-slate-400 transition-all"
                  value={editName}
                  onChange={(e: any) => setEditName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Tag size={12} className="mr-1.5" />
                  标签 (Tags)
                </label>
                <input 
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium placeholder-slate-400 transition-all"
                  value={editTags}
                  onChange={(e: any) => setEditTags(e.target.value)}
                  placeholder="用逗号分隔"
                />
              </div>
              
              <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                <strong>注意：</strong> 修改此处仅更新用例的元数据（名称和标签），不会重新运行 AI 仿真或改变已生成的任务步骤。
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50 rounded-b-2xl">
               <button 
                 onClick={onClose}
                 className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
               >
                 取消
               </button>
               <button 
                 onClick={handleSaveEdit}
                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center"
               >
                 <Save size={16} className="mr-2" />
                 保存更改
               </button>
            </div>
          </div>
        </div>
    );
};