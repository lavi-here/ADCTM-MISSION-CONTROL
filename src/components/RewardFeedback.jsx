import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FLOW_STEPS = [
  { id: 'action', label: 'Cooling Action', color: 'blue' },
  { id: 'stability', label: 'Thermal Stability', color: 'teal' },
  { id: 'energy', label: 'Energy Consumption', color: 'cyan' },
  { id: 'pue', label: 'PUE Improvement', color: 'emerald' },
  { id: 'reward', label: 'Reward Calculation', color: 'purple' },
  { id: 'update', label: 'PPO Policy Update', color: 'blue' },
];

const COLORS = {
  blue: 'bg-blue-600 text-white',
  teal: 'bg-teal-600 text-white',
  cyan: 'bg-cyan-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  purple: 'bg-purple-600 text-white',
};

export default function RewardFeedback() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Reward Feedback & Continuous Learning</h3>
          <p className="text-slate-500 text-xs mt-0.5">Simulated PPO policy update loop · prototype metrics</p>
        </div>
      </div>

      {/* Horizontal flow */}
      <div className="flex items-center gap-1 flex-wrap mb-5">
        {FLOW_STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <div className={`px-3 py-2 rounded-lg text-xs font-semibold ${COLORS[step.color]} shadow-sm text-center whitespace-nowrap`}>
              {step.label}
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <ArrowRight size={14} className="text-slate-400 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Thermal Stability" value="94%" color="teal" sub="Simulated metric" />
        <MetricCard label="Energy Efficiency" value="88%" color="blue" sub="Simulated metric" />
        <MetricCard label="PUE Improvement" value="+12%" color="emerald" sub="vs. baseline" />
        <MetricCard label="Policy Improvement" value="+7.4%" color="purple" sub="Last update cycle" />
      </div>
    </div>
  );
}

function MetricCard({ label, value, color, sub }) {
  const text = {
    teal: 'text-teal-600', blue: 'text-blue-600', emerald: 'text-emerald-600', purple: 'text-purple-600',
  };
  const bg = {
    teal: 'bg-teal-50 border-teal-100', blue: 'bg-blue-50 border-blue-100',
    emerald: 'bg-emerald-50 border-emerald-100', purple: 'bg-purple-50 border-purple-100',
  };
  return (
    <div className={`rounded-lg border p-4 text-center ${bg[color]}`}>
      <div className={`text-2xl font-bold ${text[color]} mb-1 mono`}>{value}</div>
      <div className="text-slate-700 text-xs font-medium">{label}</div>
      <div className="text-slate-400 text-[10px] mt-0.5">{sub}</div>
    </div>
  );
}
