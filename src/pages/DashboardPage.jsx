import React from 'react';
import { ArrowDown, TrendingUp, Shield, Layers, Zap, AlertTriangle } from 'lucide-react';
import ThermalChart from '../components/ThermalChart';
import ThermalHeatmap from '../components/ThermalHeatmap';
import AICortexPanel from '../components/AICortexPanel';
import EventLog from '../components/EventLog';
import { useApp } from '../context/AppContext';

function KPICard({ icon: Icon, label, value, sub, color, unit }) {
  const colors = {
    blue: 'border-blue-200 bg-blue-50',
    teal: 'border-teal-200 bg-teal-50',
    emerald: 'border-emerald-200 bg-emerald-50',
    purple: 'border-purple-200 bg-purple-50',
  };
  const textColors = {
    blue: 'text-blue-700', teal: 'text-teal-700', emerald: 'text-emerald-700', purple: 'text-purple-700',
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]} shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
          <Icon size={18} className={textColors[color]} />
        </div>
        <span className="text-xs text-slate-400 font-medium">Demo metric</span>
      </div>
      <div className={`text-3xl font-black ${textColors[color]} mb-1 mono`}>
        {typeof value === 'number' ? value.toFixed(value % 1 !== 0 ? 1 : 0) : value}
        {unit && <span className="text-xl font-bold">{unit}</span>}
      </div>
      <div className="text-slate-700 text-sm font-semibold mb-0.5">{label}</div>
      <div className="text-slate-500 text-xs">{sub}</div>
    </div>
  );
}

// Workflow step component
function WorkflowStep({ number, label, desc, active }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${active ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5
        ${active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
        {number}
      </div>
      <div>
        <div className={`text-xs font-semibold ${active ? 'text-blue-800' : 'text-slate-700'}`}>{label}</div>
        <div className="text-slate-500 text-[11px] mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { kpis, sensors, scenario } = useApp();

  // Count criticals/hotzone sensors
  const criticalCount = sensors.filter(s => s.status === 'CRITICAL').length;
  const hotCount = sensors.filter(s => s.status === 'HOT').length;

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-black tracking-tight">Data Center Thermal Intelligence</h1>
              <p className="text-slate-400 text-sm mt-1">AI-powered real-time monitoring and autonomous cooling optimization</p>
            </div>
            <div className="flex items-center gap-3">
              {(criticalCount > 0 || scenario.peak) && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-xl critical-blink">
                  <AlertTriangle size={16} className="text-red-400" />
                  <span className="text-red-300 text-sm font-bold">{criticalCount} CRITICAL SENSORS</span>
                </div>
              )}
              <div className="text-right">
                <div className="text-xs text-slate-400 mb-0.5">PPO Agent Simulation</div>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" />
                  <span className="text-cyan-400 text-sm font-bold">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard icon={TrendingUp} label="Efficiency Index" value={kpis.efficiency} unit="%" sub="Cooling efficiency vs energy consumption" color="blue" />
        <KPICard icon={Shield} label="Safety Margin" value={kpis.safety} sub="Thermal safety health score" color="emerald" />
        <KPICard icon={Layers} label="Active Zones" value={kpis.activeZones} sub="Zones under AI control" color="teal" />
        <KPICard icon={Zap} label="Power Load" value={kpis.powerLoad} unit=" MW" sub="Current infrastructure load" color="purple" />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left: chart + heatmap */}
        <div className="col-span-2 space-y-5">
          <ThermalChart />
          <ThermalHeatmap />
        </div>

        {/* Right: AI Cortex + events */}
        <div className="space-y-5">
          <AICortexPanel />
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Live Events</h3>
              <span className="text-xs text-slate-400 mono">{sensors.filter(s => s.status !== 'NORMAL' && s.status !== 'COOL').length} anomalies</span>
            </div>
            <EventLog limit={8} compact />
          </div>
        </div>
      </div>

      {/* Workflow demo flow */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-4">ADCTM System Workflow</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-2">
          {[
            ['1', 'Sensor Data', '124 nodes capture thermal state'],
            ['2', 'Telemetry Bridge', 'DCIM/BMS ingestion'],
            ['3', 'State Vector', 'AI state representation'],
            ['4', 'PPO Evaluation', 'Actor-Critic inference'],
            ['5', 'Action Selection', 'Cooling recommendation'],
            ['6', 'Safety Check', 'Guardrail validation'],
            ['7', 'Cooling Response', 'Infrastructure actuation'],
            ['8', 'Stability Measure', 'PUE & thermal feedback'],
            ['9', 'Policy Update', 'Continuous learning'],
          ].map(([num, label, desc], i) => (
            <WorkflowStep key={num} number={num} label={label} desc={desc} active={scenario.active && i === (scenario.step - 1)} />
          ))}
        </div>
      </div>
    </div>
  );
}
