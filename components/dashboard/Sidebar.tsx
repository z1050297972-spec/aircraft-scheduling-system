import React from 'react';
import { Plane, ChevronRight, User, LogOut } from 'lucide-react';
import { ViewState } from '../../types';

interface NavItem {
  id: string;
  icon: any;
  label: string;
}

interface Props {
  view: ViewState;
  setView: (v: ViewState) => void;
  username: string;
  navItems: NavItem[];
  onLogout: () => void;
}

const Sidebar: React.FC<Props> = ({ view, setView, username, navItems, onLogout }) => {
  return (
    <aside className="w-72 hidden md:flex flex-col z-20 relative m-4 mr-0 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl">
      <div className="p-6 pb-2">
        <div className="flex items-center space-x-3 text-blue-700 mb-8">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Plane size={22} fill="currentColor" strokeWidth={0} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800 leading-tight">测试系统</h1>
            <p className="text-[9px] text-slate-400 font-mono tracking-[0.2em] uppercase">Powered by NEU</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group relative overflow-hidden ${view === item.id
                ? 'text-white shadow-md shadow-blue-500/30'
                : 'text-slate-600 hover:bg-white/60 hover:shadow-sm'
              }`}
          >
            {view === item.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"></div>
            )}

            <div className="flex items-center space-x-3 relative z-10">
              <item.icon size={20} strokeWidth={view === item.id ? 2.5 : 2} className={view === item.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100 transition-opacity'} />
              <span className={`font-medium tracking-wide ${view === item.id ? 'font-bold' : ''}`}>{item.label}</span>
            </div>
            {view === item.id && <ChevronRight size={16} className="opacity-80 relative z-10" />}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-slate-50 to-white/50 p-4 rounded-xl border border-slate-200/50 shadow-sm mb-3 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm ring-2 ring-blue-50 relative">
              <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              <User size={18} />
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-slate-800 text-sm truncate">{username || 'Administrator'}</div>
              <div className="text-slate-400 text-xs flex items-center mt-0.5">
                <span className="w-1 h-1 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>

              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 text-slate-500 hover:text-red-600 hover:bg-red-50/50 py-2 rounded-lg text-xs font-medium transition-colors border border-transparent hover:border-red-100"
          >
            <LogOut size={14} />
            <span>安全登出</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;