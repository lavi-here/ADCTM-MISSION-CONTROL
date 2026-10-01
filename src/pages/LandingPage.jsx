import React from 'react';
import { ArrowDown, Zap, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ARCH_STEPS = [
  { label: '124 Thermal Sensors', sub: 'Temperature · Humidity · Airflow · Power', color: 'bg-blue-600' },
  { label: 'DCIM / BMS Bridge', sub: 'Secure telemetry ingestion layer', color: 'bg-blue-700' },
  { label: 'Real-Time Telemetry', sub: 'State representation vector', color: 'bg-slate-700' },
  { label: 'PPO AI Agent', sub: 'Actor-Critic reinforcement learning', color: 'bg-cyan-600' },
  { label: 'Cooling Control', sub: 'Autonomous fan · chiller management', color: 'bg-teal-600' },
  { label: 'Physical Infrastructure', sub: 'Cooling plant response', color: 'bg-slate-600' },
  { label: 'Feedback Loop', sub: 'Thermal stability · PUE measurement', color: 'bg-emerald-600' },
  { label: 'Policy Update', sub: 'Continuous PPO improvement', color: 'bg-purple-600' },
];

export default function LandingPage({ onEnter }) {
  const [showArch, setShowArch] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      {/* Demo badge */}
      <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot" />
        <span className="text-amber-400 text-xs font-semibold tracking-wider mono">DEMO MODE · PROTOTYPE</span>
      </div>

      {/* System online badge top-left */}
      <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
        <span className="text-emerald-400 text-xs font-semibold mono">SYSTEM ONLINE</span>
      </div>

      {/* Main content */}
      <div className="text-center max-w-3xl px-6 relative z-10">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-900/50">
            <Zap size={30} className="text-white" />
          </div>
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-widest mb-4 mono">
          ADCTM · MISSION CONTROL
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
          Automatic Data Centre<br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Thermal Management</span>
        </h1>

        <p className="text-slate-400 text-lg mb-3">
          Deep Reinforcement Learning for Data Center Thermal Optimization
        </p>

        <p className="text-slate-500 text-sm mb-10 max-w-xl mx-auto leading-relaxed">
          Real-time monitoring · Predictive heat-spike detection · PPO autonomous cooling · Continuous learning
        </p>

        {/* Status pills */}
        <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
          {['REAL-TIME', 'PREDICTIVE', 'AI-DRIVEN', 'THERMAL OPTIMIZATION'].map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-semibold tracking-widest mono">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onEnter}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-2xl shadow-blue-900/50 hover:shadow-blue-900/70 hover:scale-105"
          >
            <Zap size={16} />
            ENTER MISSION CONTROL
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setShowArch(a => !a)}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-semibold text-sm transition-all backdrop-blur-sm"
          >
            {showArch ? 'HIDE ARCHITECTURE' : 'VIEW ARCHITECTURE'}
          </button>
        </div>

        {/* Architecture diagram */}
        {showArch && (
          <div className="mt-10 flex flex-col items-center gap-1 fade-in">
            <div className="text-slate-400 text-xs mb-3 font-semibold tracking-widest">SYSTEM ARCHITECTURE</div>
            {ARCH_STEPS.map((step, i) => (
              <React.Fragment key={step.label}>
                <div className={`${step.color} text-white rounded-xl px-6 py-2.5 text-center shadow-lg w-72`}>
                  <div className="font-bold text-sm">{step.label}</div>
                  <div className="text-white/60 text-[11px] mt-0.5">{step.sub}</div>
                </div>
                {i < ARCH_STEPS.length - 1 && (
                  <ArrowDown size={16} className="text-slate-600" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Bottom metadata */}
      <div className="absolute bottom-6 text-center text-slate-600 text-xs">
        Prototype · PPO Agent Simulation · Mock Sensor Data · No real hardware controlled
      </div>
    </div>
  );
}
