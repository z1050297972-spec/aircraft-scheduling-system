import React from 'react';
import { Plane } from 'lucide-react';

interface Props {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onLogin: (e: React.FormEvent) => void;
}

const LoginView: React.FC<Props> = ({ username, setUsername, password, setPassword, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Background Rotating Pointer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.05]">
        <svg width="1000" height="1000" viewBox="0 0 800 800" className="animate-[spin_12s_linear_infinite] text-slate-900">
          <circle cx="400" cy="400" r="25" fill="currentColor" />
          <path d="M392 400 L400 20 L408 400 L400 450 Z" fill="currentColor" />
          <circle cx="400" cy="400" r="10" fill="white" fillOpacity="0.5" />
        </svg>
      </div>

      <div className="bg-white/70 backdrop-blur-2xl p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md border border-white/60 relative z-10 animate-in fade-in zoom-in duration-500 mx-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30 mb-6 transform hover:rotate-6 transition-transform duration-500 hover:scale-105">
            <Plane className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">飞机调度测试用例生成系统</h1>
          <p className="text-slate-500 mt-3 font-light text-xs md:text-sm tracking-wide uppercase">Powered by NEU</p>
        </div>
        <form onSubmit={onLogin} className="space-y-4 md:space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">账号</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-sm md:text-base"
              placeholder="Admin"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">密码</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-sm md:text-base"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform active:scale-[0.98] mt-2 group relative overflow-hidden text-sm md:text-base">
            <span className="relative z-10">进入系统</span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </form>
        <div className="mt-8 text-center flex justify-center">
          <div className="flex items-center px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2"></div>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest">
              SYSTEM ONLINE V1.0.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;