import React from 'react';
import EventLog from '../components/EventLog';
import { useApp } from '../context/AppContext';
import { FileText } from 'lucide-react';

export default function EventsPage() {
  const { events } = useApp();

  const countBySeverity = events.reduce((acc, e) => {
    acc[e.severity] = (acc[e.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-xl flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            System Event Log
          </h2>
          <p className="text-slate-500 text-sm">Real-time simulation event stream · {events.length} events captured</p>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(countBySeverity).map(([sev, count]) => (
            <div key={sev} className={`px-2.5 py-1 rounded-lg text-xs font-bold
              ${sev === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                sev === 'WARNING' ? 'bg-amber-100 text-amber-700' :
                sev === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' :
                'bg-blue-100 text-blue-700'}`}>
              {count} {sev}
            </div>
          ))}
        </div>
      </div>

      <EventLog limit={50} />
    </div>
  );
}
