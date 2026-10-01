import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { ppoState } from '../data/mockData';

function NetworkNode({ label, color, sub }) {
  const styles = {
    blue: 'bg-blue-600 text-white border-blue-700',
    cyan: 'bg-cyan-600 text-white border-cyan-700',
    teal: 'bg-teal-600 text-white border-teal-700',
    slate: 'bg-slate-100 text-slate-700 border-slate-300',
    emerald: 'bg-emerald-600 text-white border-emerald-700',
    purple: 'bg-purple-600 text-white border-purple-700',
  };
  return (
    <div className={`rounded-lg border-2 px-4 py-2.5 text-center text-xs font-bold tracking-wide shadow-sm ${styles[color]}`}>
      {label}
      {sub && <div className="text-[10px] font-normal opacity-80 mt-0.5">{sub}</div>}
    </div>
  );
}

function FlowArrow({ label }) {
  return (
    <div className="flex flex-col items-center py-1">
      <ArrowDown size={14} className="text-slate-400" />
      {label && <span className="text-[10px] text-slate-400 mt-0.5">{label}</span>}
    </div>
  );
}

export default function PPOVisualization() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-slate-900 text-sm">PPO Actor-Critic Agent</h3>
        <p className="text-slate-500 text-xs mt-0.5">
          High-level architecture · PPO Agent Simulation — not a live trained model
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Column 1: State Input */}
        <div className="flex flex-col items-center">
          <div className="w-full rounded-lg bg-slate-50 border border-slate-200 p-3 mb-3">
            <div className="text-xs font-bold text-slate-700 mb-2 text-center">State Input</div>
            <div className="space-y-1">
              {ppoState.inputs.map(inp => (
                <div key={inp} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  {inp}
                </div>
              ))}
            </div>
          </div>

          {/* Actor path */}
          <div className="flex flex-col items-center w-full gap-1">
            <FlowArrow />
            <NetworkNode label="Actor Network" color="blue" sub="Policy π(a|s)" />
            <FlowArrow />
            <NetworkNode label="Cooling Action" color="cyan" />
          </div>

          {/* Action list */}
          <div className="mt-3 w-full rounded-lg bg-cyan-50 border border-cyan-100 p-2.5">
            <div className="text-[10px] font-bold text-cyan-700 mb-1.5">Actions</div>
            {ppoState.actions.map(a => (
              <div key={a} className="flex items-center gap-1.5 text-[11px] text-cyan-600 mb-1">
                <ArrowRight size={9} /> {a}
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Center divider */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-px h-full bg-slate-200 relative flex flex-col items-center justify-center gap-6 py-8">
            <div className="absolute bg-white px-3 py-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <span className="text-white text-[10px] font-bold text-center leading-tight">PPO<br/>Agent</span>
              </div>
              <div className="text-[10px] text-slate-500 text-center max-w-[80px] leading-relaxed">
                Proximal Policy Optimization
              </div>
              {/* Animated ring */}
              <svg width={60} height={60} className="spin-slow opacity-30">
                <circle cx={30} cy={30} r={26} fill="none" stroke="#06b6d4" strokeWidth={2} strokeDasharray="8 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Column 3: Critic path */}
        <div className="flex flex-col items-center">
          <div className="w-full rounded-lg bg-slate-50 border border-slate-200 p-3 mb-3">
            <div className="text-xs font-bold text-slate-700 mb-2 text-center">State Input</div>
            <div className="space-y-1">
              {ppoState.inputs.map(inp => (
                <div key={inp} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  {inp}
                </div>
              ))}
            </div>
          </div>

          {/* Critic path */}
          <div className="flex flex-col items-center w-full gap-1">
            <FlowArrow />
            <NetworkNode label="Critic Network" color="purple" sub="Value V(s)" />
            <FlowArrow />
            <NetworkNode label="Value Estimate" color="teal" />
          </div>

          {/* Reward list */}
          <div className="mt-3 w-full rounded-lg bg-teal-50 border border-teal-100 p-2.5">
            <div className="text-[10px] font-bold text-teal-700 mb-1.5">Rewards</div>
            {ppoState.rewards.map(r => (
              <div key={r} className="flex items-center gap-1.5 text-[11px] text-teal-600 mb-1">
                <ArrowRight size={9} /> {r}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update loop */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-100 font-medium">Actor Loss</span>
        <ArrowRight size={12} />
        <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded border border-purple-100 font-medium">Critic Loss</span>
        <ArrowRight size={12} />
        <span className="px-2 py-1 bg-teal-50 text-teal-600 rounded border border-teal-100 font-medium">Policy Update</span>
        <ArrowRight size={12} />
        <span className="px-2 py-1 bg-cyan-50 text-cyan-600 rounded border border-cyan-100 font-medium">Clipped PPO Objective</span>
        <span className="ml-auto text-slate-400 italic">Simulated continuous learning</span>
      </div>
    </div>
  );
}
