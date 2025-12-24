import React from 'react';
import { Aircraft } from '../types';
import { X, Activity, Droplet, Wind, ArrowUp, Zap, Calendar } from 'lucide-react';

interface Props {
  aircraft: Aircraft | null;
  onClose: () => void;
}

const AircraftDetailModal: React.FC<Props> = ({ aircraft, onClose }) => {
  if (!aircraft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white md:rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl overflow-y-auto md:overflow-hidden animate-in fade-in zoom-in duration-200 relative z-10 border-0 md:border border-white/50 flex flex-col">
        
        {/* Header with Visual Status Indicator */}
        <div className="relative bg-slate-50 border-b border-slate-100 overflow-hidden shrink-0">
           {/* Abstract Background Graphic */}
           <div className={`absolute top-0 right-0 w-64 h-full opacity-10 transform skew-x-12 translate-x-10 ${
             aircraft.status === 'normal' ? 'bg-emerald-500' :
             aircraft.status === 'maintenance' ? 'bg-amber-500' : 'bg-blue-600'
           }`}></div>

           <div className="p-4 md:p-6 flex justify-between items-start relative z-10">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 ${
                    aircraft.status === 'normal' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                    aircraft.status === 'maintenance' ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 
                    'bg-gradient-to-br from-blue-500 to-indigo-600'
                 }`}>
                    <Zap className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" />
                 </div>
                 <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight font-mono">{aircraft.code}</h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base">{aircraft.model} 型多用途战斗机</p>
                 </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
           </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-white/80 overflow-y-auto pb-8">
          
          {/* Left Column: Specs */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
              <Activity size={14} className="mr-2" />
              性能参数 (Specifications)
            </h3>
            
            <div className="grid gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
                <div className="flex items-center text-slate-600">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <Wind size={18} />
                  </div>
                  <span className="font-medium">最大速度</span>
                </div>
                <span className="font-mono font-bold text-xl text-slate-800">{aircraft.maxSpeed} <span className="text-xs text-slate-400 font-normal">km/h</span></span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
                <div className="flex items-center text-slate-600">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                     <ArrowUp size={18} />
                  </div>
                  <span className="font-medium">最大高度</span>
                </div>
                <span className="font-mono font-bold text-xl text-slate-800">{aircraft.maxHeight} <span className="text-xs text-slate-400 font-normal">m</span></span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 group hover:border-emerald-200 transition-colors">
                <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center text-slate-600">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg mr-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Activity size={18} />
                      </div>
                      <span className="font-medium">系统健康度</span>
                   </div>
                   <span className="font-mono font-bold text-xl text-emerald-600">{aircraft.health}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${aircraft.health}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Resources */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
              <Droplet size={14} className="mr-2" />
              物资状态 (Consumables)
            </h3>
            
            <div className="space-y-5">
              {[
                { label: '燃油储量 (Fuel)', value: aircraft.consumables.fuelLevel, color: 'bg-blue-500', iconColor: 'text-blue-500' },
                { label: '润滑油 (Oil)', value: aircraft.consumables.oilLevel, color: 'bg-slate-600', iconColor: 'text-slate-600' },
                { label: '液压液 (Hydraulic)', value: aircraft.consumables.hydraulicFluid, color: 'bg-purple-500', iconColor: 'text-purple-500' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                    <span className="font-mono font-bold text-slate-800">{item.value}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div className={`h-full ${item.color} transition-all duration-700 rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm text-slate-500 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                <span className="flex items-center"><Calendar size={16} className="mr-2 text-slate-400"/> 上次维护时间</span>
                <span className="font-mono font-medium text-slate-700">{aircraft.lastMaintenance}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AircraftDetailModal;