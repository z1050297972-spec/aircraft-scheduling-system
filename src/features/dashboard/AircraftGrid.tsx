import React, { useState } from 'react';
import { Radar, Filter, CheckCircle2, Wrench, Zap, ChevronRight, Droplet, Activity } from 'lucide-react';
import { Aircraft } from '../../types';

interface Props {
  aircraftList: Aircraft[];
  onSelectAircraft: (a: Aircraft) => void;
}

type FilterType = 'all' | 'normal' | 'maintenance' | 'mission';

const AircraftGrid: React.FC<Props> = ({ aircraftList, onSelectAircraft }) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const getStatusStyles = (status: Aircraft['status']) => {
    switch(status) {
      case 'normal': return {
        bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-200',
        gradient: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/20'
      };
      case 'maintenance': return {
        bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'border-amber-200',
        gradient: 'from-amber-500 to-orange-400', shadow: 'shadow-amber-500/20'
      };
      case 'mission': return {
        bg: 'bg-blue-500/10', text: 'text-blue-700', border: 'border-blue-200',
        gradient: 'from-blue-600 to-indigo-500', shadow: 'shadow-blue-500/20'
      };
      default: return {
        bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200',
        gradient: 'from-slate-400 to-slate-500', shadow: 'shadow-slate-500/20'
      };
    }
  };

  const getStatusLabel = (status: Aircraft['status']) => {
    switch(status) {
      case 'normal': return '就绪 (READY)';
      case 'maintenance': return '维护 (MAINT)';
      case 'mission': return '任务 (ACTIVE)';
      default: return '未知';
    }
  };

  const filteredAircraft = aircraftList.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div className="relative">
          <div className="absolute -left-12 -top-12 opacity-10 pointer-events-none">
              <Radar size={200} className="animate-radar text-blue-600"/>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight relative z-10">态势监控中心</h2>
          <p className="text-slate-500 mt-2 flex items-center text-xs md:text-sm relative z-10">
            <span className="flex h-2 w-2 mr-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            实时数据同步中 • 更新于 08:32:45
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap bg-white/80 backdrop-blur rounded-xl p-1 shadow-sm border border-slate-200 w-full md:w-auto overflow-x-auto">
            {[
              { id: 'all', label: '全部' },
              { id: 'normal', label: '就绪', icon: CheckCircle2, color: 'text-emerald-600' },
              { id: 'maintenance', label: '维护', icon: Wrench, color: 'text-amber-600' },
              { id: 'mission', label: '任务', icon: Zap, color: 'text-blue-600' }
            ].map((tab) => (
              <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FilterType)}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center space-x-2 shrink-0 ${
                filter === tab.id 
                ? 'bg-white text-slate-800 shadow-md ring-1 ring-slate-100' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
                {tab.icon && <tab.icon size={14} className={filter === tab.id ? tab.color : ''} />}
                <span>{tab.label}</span>
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredAircraft.map((aircraft, idx) => {
          const statusStyle = getStatusStyles(aircraft.status);
          return (
            <div 
              key={aircraft.id}
              onClick={() => onSelectAircraft(aircraft)}
              className="group bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Status Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${statusStyle.gradient} opacity-10 rounded-bl-[100px] -mr-8 -mt-8 transition-opacity group-hover:opacity-20`}></div>

              {/* Top Color Line */}
              <div className={`h-1 w-full bg-gradient-to-r ${statusStyle.gradient}`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center">
                        <h3 className="font-bold text-2xl text-slate-800 font-mono group-hover:text-blue-600 transition-colors tracking-tight">{aircraft.code}</h3>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{aircraft.model} FIGHTER</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} uppercase tracking-wider shadow-sm backdrop-blur-md`}>
                    {getStatusLabel(aircraft.status)}
                  </span>
                </div>
                
                <div className="space-y-5">
                  {/* Fuel */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium flex items-center"><Droplet size={12} className="mr-1"/> 燃油</span>
                      <span className={`font-mono font-bold ${aircraft.consumables.fuelLevel < 20 ? 'text-red-500' : 'text-slate-700'}`}>{aircraft.consumables.fuelLevel}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out animate-progress ${aircraft.consumables.fuelLevel < 20 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`} 
                        style={{width: `${aircraft.consumables.fuelLevel}%`}}
                      />
                    </div>
                  </div>

                  {/* Health */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium flex items-center"><Activity size={12} className="mr-1"/> 健康度</span>
                      <span className={`font-mono font-bold ${aircraft.health < 80 ? 'text-amber-600' : 'text-slate-700'}`}>{aircraft.health}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out animate-progress ${aircraft.health < 80 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`} 
                        style={{width: `${aircraft.health}%`, animationDelay: '200ms'}}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center group-hover:bg-slate-50 transition-colors">
                <span className="text-[10px] text-slate-400 font-mono tracking-widest">ID: {aircraft.id.padStart(4, '0')}</span>
                <div className="flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <span className="text-xs font-bold mr-1">查看详情</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          );
        })}
        {filteredAircraft.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
              <Filter size={48} className="mb-4 opacity-20" />
              <p>没有找到符合当前状态的飞机</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AircraftGrid;