import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// Color maps for sensor thermal state
const STATUS_COLORS = {
  COOL: { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', dot: '#3b82f6' },
  NORMAL: { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46', dot: '#10b981' },
  WARM: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e', dot: '#f59e0b' },
  HOT: { bg: '#fed7aa', border: '#fb923c', text: '#9a3412', dot: '#f97316' },
  CRITICAL: { bg: '#fee2e2', border: '#f87171', text: '#991b1b', dot: '#ef4444' },
};

export default function ThermalHeatmap() {
  const { sensors } = useApp();
  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

  if (!sensors.length) return null;

  // 124 sensors in a 12x11 grid (last row partial)
  const cols = 12;

  function getTempColor(temp) {
    if (temp < 22) return '#bfdbfe'; // cool blue
    if (temp < 25) return '#6ee7b7'; // normal green
    if (temp < 28) return '#fde68a'; // warm yellow
    if (temp < 32) return '#fb923c'; // hot orange
    if (temp < 36) return '#f87171'; // hot red-orange
    return '#dc2626'; // critical red
  }

  function handleClick(sensor, e) {
    setSelected(sensor);
    const rect = e.currentTarget.closest('.heatmap-container').getBoundingClientRect();
    const cellRect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: cellRect.left - rect.left + cellRect.width / 2,
      y: cellRect.top - rect.top - 8,
    });
  }

  function handleClose() {
    setSelected(null);
    setTooltip({ visible: false, x: 0, y: 0 });
  }

  // Count statuses
  const statusCounts = sensors.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Rack Thermal Heatmap</h3>
          <p className="text-slate-500 text-xs mt-0.5">124 sensor nodes · Click any sensor for details</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(STATUS_COLORS).map(([status, c]) => (
            <div key={status} className="flex items-center gap-1.5 text-xs">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: c.dot }} />
              <span className="text-slate-600 capitalize">{status.toLowerCase()}</span>
              <span className="text-slate-400 mono">({statusCounts[status] || 0})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="heatmap-container relative">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {sensors.map((sensor, i) => {
            const color = getTempColor(sensor.temperature);
            const isSelected = selected?.id === sensor.id;
            return (
              <div
                key={sensor.id}
                onClick={(e) => handleClick(sensor, e)}
                className="sensor-cell rounded aspect-square flex items-center justify-center text-[8px] font-bold relative"
                style={{
                  background: color,
                  border: isSelected ? '2px solid #2563eb' : `1px solid ${color}cc`,
                  color: sensor.temperature > 32 ? '#fff' : '#334155',
                  boxShadow: sensor.status === 'CRITICAL' ? `0 0 6px ${color}` : 'none',
                }}
                title={`${sensor.id} — ${sensor.temperature}°C`}
              >
                {sensor.status === 'CRITICAL' && (
                  <span className="absolute inset-0 rounded critical-blink opacity-40" style={{ background: color }} />
                )}
                <span className="relative z-10 select-none text-[7px] leading-none">
                  {sensor.temperature}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tooltip card */}
        {selected && (
          <div
            className="absolute z-20 pointer-events-auto"
            style={{
              left: Math.max(0, Math.min(tooltip.x - 100, 500)),
              top: Math.max(0, tooltip.y - 220),
            }}
          >
            <div className="bg-slate-900 text-white rounded-xl p-4 shadow-2xl border border-slate-700 w-52 fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm mono text-cyan-400">{selected.id}</span>
                <button onClick={handleClose} className="text-slate-500 hover:text-white text-xs">✕</button>
              </div>
              <div className="space-y-2 text-xs">
                <Row label="Temperature" value={`${selected.temperature}°C`} highlight />
                <Row label="Humidity" value={`${selected.humidity}%`} />
                <Row label="Airflow" value={`${selected.airflow}%`} />
                <Row label="Power Load" value={`${selected.powerLoad}%`} />
                <Row label="Zone" value={selected.zoneName} />
                <div className="flex justify-between items-center pt-1 border-t border-slate-700">
                  <span className="text-slate-400">Status</span>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone row labels */}
      <div className="flex justify-between mt-3 px-1">
        {['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3'].map(z => (
          <span key={z} className="text-slate-400 text-[10px] mono">{z}</span>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-orange-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    COOL: 'bg-blue-500/20 text-blue-300',
    NORMAL: 'bg-emerald-500/20 text-emerald-300',
    WARM: 'bg-amber-500/20 text-amber-300',
    HOT: 'bg-orange-500/20 text-orange-300',
    CRITICAL: 'bg-red-500/20 text-red-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors[status]}`}>{status}</span>
  );
}
