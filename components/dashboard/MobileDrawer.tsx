import React from 'react';
import { Plane, ChevronRight, User, LogOut, X } from 'lucide-react';
import { ViewState } from '../../types';

interface NavItem {
  id: string;
  icon: any;
  label: string;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  view: ViewState;
  setView: (v: ViewState) => void;
  username: string;
  navItems: NavItem[];
  onLogout: () => void;
}

const MobileDrawer: React.FC<Props> = ({ isOpen, setIsOpen, view, setView, username, navItems, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-start">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="relative w-72 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
        <div className="p-6 pb-2">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-3 text-blue-700">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg text-white shadow-lg">
                <Plane size={20} fill="currentColor" strokeWidth={0} />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-slate-800 leading-tight">天翼调度</h1>
                <p className="text-[9px] text-slate-400 font-mono tracking-[0.2em] uppercase">Aero-Dispatch</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setView(item.id as ViewState);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  view === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={20} strokeWidth={view === item.id ? 2.5 : 2} />
                  <span className={`font-medium ${view === item.id ? 'font-bold' : ''}`}>{item.label}</span>
                </div>
                {view === item.id && <ChevronRight size={16} className="opacity-80" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 border border-slate-200">
                  <User size={18} />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">{username || 'Administrator'}</div>
                <div className="text-slate-400 text-xs flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                  Online
                </div>
              </div>
            </div>
            <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 text-slate-500 hover:text-red-600 py-2 text-xs font-medium"
            >
            <LogOut size={14} />
            <span>安全登出</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;