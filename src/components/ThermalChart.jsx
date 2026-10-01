import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useApp } from '../context/AppContext';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2 mono">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-slate-300 capitalize">{p.dataKey}:</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}°C</span>
        </div>
      ))}
    </div>
  );
};

export default function ThermalChart() {
  const { thermalHistory, scenario } = useApp();

  const data = thermalHistory.slice(-20);
  const latest = data[data.length - 1];
  const spikeDetected = latest && latest.predicted > 34;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Thermal Dynamics Vector</h3>
          <p className="text-slate-500 text-xs mt-0.5">Real-time thermal state · Demo telemetry stream</p>
        </div>
        <div className="flex items-center gap-2">
          {(spikeDetected || scenario.peak) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-600 font-medium critical-blink">
              <AlertTriangle size={11} />
              Heat Spike Detected
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-600 font-medium">
            <TrendingUp size={11} />
            Pre-emptive cooling recommended
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
            interval="preserveStartEnd"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[20, 42]}
            tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}°`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="text-xs text-slate-600 capitalize">{value}</span>}
            iconType="circle"
            iconSize={8}
          />
          <ReferenceLine y={35} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5}
            label={{ value: 'Warning 35°C', position: 'insideTopRight', fontSize: 9, fill: '#f97316' }} />
          <ReferenceLine y={38} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5}
            label={{ value: 'Critical 38°C', position: 'insideTopRight', fontSize: 9, fill: '#ef4444' }} />
          <Line type="monotone" dataKey="setpoint" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1.5}
            dot={false} name="Setpoint" />
          <Line type="monotone" dataKey="active" stroke="#2563eb" strokeWidth={2.5}
            dot={false} name="Active Temp" activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="predicted" stroke="#f97316" strokeWidth={2} strokeDasharray="6 3"
            dot={false} name="Predicted Temp" />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend extra info */}
      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
        <span>Setpoint: <strong className="text-slate-700 mono">27°C</strong></span>
        <span>Active: <strong className="text-blue-600 mono">{latest?.active}°C</strong></span>
        <span>Predicted: <strong className="text-orange-500 mono">{latest?.predicted}°C</strong></span>
        <span className="ml-auto text-slate-400">Simulated telemetry · PPO prediction overlay</span>
      </div>
    </div>
  );
}
