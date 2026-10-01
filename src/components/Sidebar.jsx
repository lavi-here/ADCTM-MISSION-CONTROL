import React, { useState } from 'react';
import {
  LayoutDashboard, Thermometer, Brain, Wind, BarChart3,
  FileText, Settings, ChevronRight, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Mission Control', icon: LayoutDashboard },
  { id: 'thermal', label: 'Thermal Monitoring', icon: Thermometer },
  { id: 'cortex', label: 'AI Cortex', icon: Brain },
  { id: 'cooling', label: 'Cooling Control', icon: Wind },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'events', label: 'Event Log', icon: FileText },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { scenario, isLive } = useApp();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col border-r border-slate-700/50 flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-wide">ADCTM</div>
            <div className="text-slate-400 text-xs">Mission Control</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot inline-block"></span>
          <span className="text-emerald-400 text-xs font-medium mono">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Demo Mode Badge */}
      <div className="mx-4 mt-4 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-center">
        <span className="text-amber-400 text-xs font-semibold tracking-wider mono">◈ DEMO MODE</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-left group
                ${active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <Icon size={16} className={active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="flex-1 font-medium">{label}</span>
              {active && <ChevronRight size={14} className="text-blue-200" />}
            </button>
          );
        })}
      </nav>

      {/* Live status */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Simulation</span>
          <span className={`font-medium ${isLive ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isLive ? 'LIVE' : 'PAUSED'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">PPO Agent</span>
          <span className="text-cyan-400 font-medium">ACTIVE</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Sensors</span>
          <span className="text-slate-300 font-medium mono">124 / 124</span>
        </div>
        {scenario.active && (
          <div className="mt-2 px-2 py-1 rounded bg-orange-500/10 border border-orange-500/30">
            <span className="text-orange-400 text-xs font-medium">⚡ Scenario Running</span>
          </div>
        )}
      </div>

      {/* Prototype label */}
      <div className="p-4 pt-0">
        <div className="text-slate-600 text-xs text-center">
          Prototype · PPO Simulation · Mock Data
        </div>
      </div>
    </aside>
  );
}
