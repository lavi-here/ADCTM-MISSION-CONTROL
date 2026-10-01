import React from 'react';
import { Brain, CheckCircle, AlertCircle, Zap, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ACTION_LABELS = {
  COOLING_PULSE: 'Cooling Pulse',
  EMERGENCY_COOLING: 'Emergency Cooling',
  MAINTAIN: 'Maintain Current',
  REDUCE_LOAD: 'Reduce Load',
};

const RISK_STYLES = {
  LOW: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
  MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  HIGH: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
};

function ConfidenceRing({ confidence }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (confidence / 100) * circumference;
  const uncertainty = 100 - confidence;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={128} height={128} className="-rotate-90">
        {/* Track */}
        <circle cx={64} cy={64} r={r} fill="none" stroke="#e2e8f0" strokeWidth={10} />
        {/* Confidence arc */}
        <circle
          cx={64} cy={64} r={r}
          fill="none"
          stroke="url(#confGrad)"
          strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <defs>
          <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-slate-900">{confidence}%</span>
        <span className="text-xs text-slate-500">Confidence</span>
      </div>
    </div>
  );
}

export default function AICortexPanel() {
  const { confidence, risk, aiAction, scenario } = useApp();
  const uncertainty = 100 - confidence;
  const riskStyle = RISK_STYLES[risk] || RISK_STYLES.LOW;

  // Timeline — last 4 decision steps
  const now = new Date();
  const makeTime = (offset) => new Date(now - offset * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const timeline = [
    { time: makeTime(3), label: 'Thermal rise detected', icon: Zap, color: 'text-orange-500' },
    { time: makeTime(2), label: 'State vector updated', icon: Brain, color: 'text-blue-500' },
    { time: makeTime(1), label: 'PPO action calculated', icon: CheckCircle, color: 'text-teal-500' },
    { time: makeTime(0), label: ACTION_LABELS[aiAction] + ' recommended', icon: Zap, color: 'text-cyan-500' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Brain size={16} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm tracking-wide">CORTEX AI</h3>
          <p className="text-slate-500 text-xs">Autonomous Decision Making · PPO Agent Simulation</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 bg-cyan-50 border border-cyan-200 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
          <span className="text-cyan-700 text-xs font-semibold">ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left: confidence ring */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <ConfidenceRing confidence={confidence} />
          <div className="w-full space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Confidence</span>
              <div className="flex-1 mx-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${confidence}%` }} />
              </div>
              <span className="font-bold text-blue-600 mono">{confidence}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Uncertainty</span>
              <div className="flex-1 mx-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 rounded-full transition-all duration-500"
                  style={{ width: `${uncertainty}%` }} />
              </div>
              <span className="font-bold text-slate-500 mono">{uncertainty}%</span>
            </div>
          </div>
        </div>

        {/* Right: action + risk */}
        <div className="space-y-3">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <div className="text-slate-500 text-xs mb-1">Current Action</div>
            <div className="font-bold text-slate-900 text-sm mono">{aiAction.replace(/_/g, ' ')}</div>
          </div>

          <div className={`rounded-lg border p-3 ${riskStyle.bg} ${riskStyle.border}`}>
            <div className={`text-xs mb-1 ${riskStyle.text} opacity-70`}>Risk Level</div>
            <div className={`font-bold text-sm flex items-center gap-1.5 ${riskStyle.text}`}>
              <span className={`w-2 h-2 rounded-full ${riskStyle.dot}`} />
              {risk}
            </div>
          </div>

          {/* Description */}
          <div className="text-xs text-slate-500 leading-relaxed">
            The PPO agent evaluates real-time thermal states and recommends cooling actions based on predicted system outcomes.
          </div>
        </div>
      </div>

      {/* Decision Timeline */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-700 mb-3">AI Decision Timeline</div>
        <div className="space-y-2">
          {timeline.map((step, i) => {
            const Icon = step.icon;
            const isLatest = i === timeline.length - 1;
            return (
              <div key={i} className={`flex items-center gap-3 text-xs ${isLatest ? '' : 'opacity-60'}`}>
                <span className={`mono text-slate-400 w-16 flex-shrink-0`}>{step.time}</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                  ${isLatest ? 'bg-cyan-100 timeline-dot-active' : 'bg-slate-100'}`}>
                  <Icon size={10} className={isLatest ? step.color : 'text-slate-400'} />
                </div>
                <span className={isLatest ? 'text-slate-800 font-medium' : 'text-slate-500'}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why this action */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
          <AlertCircle size={12} className="text-blue-500" />
          WHY THIS ACTION?
        </div>
        <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs space-y-1.5">
          <Row label="Action" value={ACTION_LABELS[aiAction] || aiAction} bold />
          <Row label="Reason" value="Temperature rising faster than setpoint baseline" />
          <Row label="Expected Outcome" value="Reduce thermal risk in active zones" />
          <Row label="Confidence" value={`${confidence}%`} bold />
          <Row label="Risk Assessment" value={risk} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-slate-500 w-28 flex-shrink-0">{label}:</span>
      <span className={`text-slate-800 ${bold ? 'font-semibold' : ''}`}>{value}</span>
    </div>
  );
}
