import React from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, Zap, Cpu, Activity, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SEVERITY_STYLES = {
  INFO: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', icon: Info, dot: 'bg-blue-400' },
  SUCCESS: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', icon: CheckCircle, dot: 'bg-emerald-400' },
  WARNING: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', icon: AlertTriangle, dot: 'bg-amber-400' },
  CRITICAL: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', icon: XCircle, dot: 'bg-red-500' },
};

export default function EventLog({ limit = 20, compact = false }) {
  const { events } = useApp();

  const displayed = events.slice(0, limit);

  return (
    <div className={compact ? '' : 'bg-white rounded-xl border border-slate-200 p-5 shadow-sm'}>
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">System Event Log</h3>
            <p className="text-slate-500 text-xs mt-0.5">Real-time simulation events · {events.length} total</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            Live stream
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {displayed.map((event, i) => {
          const style = SEVERITY_STYLES[event.severity] || SEVERITY_STYLES.INFO;
          const Icon = style.icon;
          const isNew = i === 0;
          return (
            <div
              key={event.id}
              className={`flex items-start gap-3 p-3 rounded-lg border text-xs transition-all
                ${style.bg} ${style.border} ${isNew ? 'fade-in' : ''}`}
            >
              <Icon size={13} className={`${style.text} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <span className={`font-semibold ${style.text} mono`}>[{event.time}]</span>
                <span className={`ml-2 ${style.text} opacity-80`}>{event.message}</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${style.text} bg-white/60 border ${style.border} flex-shrink-0`}>
                {event.severity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
