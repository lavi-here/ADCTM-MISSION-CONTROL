import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Brain, Play, Pause, Zap, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header({ onNavigate }) {
  const { isLive, setIsLive, speed, setSpeed, scenario, runScenario, aiAction, confidence } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 flex-shrink-0 z-10">
      {/* Left: title */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <span className="font-bold text-slate-900 text-sm tracking-wide">ADCTM</span>
        <span className="text-slate-300">—</span>
        <span className="text-slate-500 text-sm">Mission Control</span>
      </div>

      {/* Center: status pills */}
      <div className="flex-1 flex items-center justify-center gap-3 flex-wrap">
        <StatusPill icon={<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />} label="SYSTEM ONLINE" color="emerald" />
        <StatusPill icon={<Wifi size={11} />} label={`Telemetry: ${isLive ? 'LIVE' : 'PAUSED'}`} color={isLive ? 'blue' : 'slate'} />
        <StatusPill icon={<Brain size={11} />} label={`PPO Agent: ACTIVE`} color="cyan" />
        <StatusPill icon={<Activity size={11} />} label={`Confidence: ${confidence}%`} color="teal" />
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Simulation speed */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          {['slow', 'normal', 'fast'].map(s => (
            <button key={s} onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors capitalize
                ${speed === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Live toggle */}
        <button onClick={() => setIsLive(l => !l)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
            ${isLive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
          {isLive ? <><Pause size={11} /> LIVE</> : <><Play size={11} /> PAUSED</>}
        </button>

        {/* Run scenario */}
        <button
          onClick={runScenario}
          disabled={scenario.active}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
            ${scenario.active
              ? 'bg-orange-100 text-orange-600 border border-orange-200 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`}>
          <Zap size={11} />
          {scenario.active ? 'Running...' : 'RUN AI SCENARIO'}
        </button>

        {/* Time */}
        <div className="text-right pl-2 border-l border-slate-200">
          <div className="text-slate-900 text-sm font-semibold mono">{timeStr}</div>
          <div className="text-slate-400 text-xs">{dateStr}</div>
        </div>
      </div>
    </header>
  );
}

function StatusPill({ icon, label, color }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    slate: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${colors[color] || colors.slate}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
