import React, { useState } from 'react';
import ThermalChart from '../components/ThermalChart';
import ThermalHeatmap from '../components/ThermalHeatmap';
import { useApp } from '../context/AppContext';
import { Thermometer, Filter } from 'lucide-react';

const STATUS_ORDER = ['ALL', 'CRITICAL', 'HOT', 'WARM', 'NORMAL', 'COOL'];
const STATUS_COLORS_BG = {
  COOL: 'bg-blue-100 text-blue-700', NORMAL: 'bg-emerald-100 text-emerald-700',
  WARM: 'bg-amber-100 text-amber-700', HOT: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

export default function ThermalMonitoringPage() {
  const { sensors } = useApp();
  const [filterZone, setFilterZone] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const zones = ['ALL', ...new Set(sensors.map(s => s.zone))].sort();
  const filtered = sensors.filter(s =>
    (filterZone === 'ALL' || s.zone === filterZone) &&
    (filterStatus === 'ALL' || s.status === filterStatus)
  );

  const statusCounts = sensors.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-xl">Thermal Monitoring</h2>
          <p className="text-slate-500 text-sm">124 sensor nodes · real-time demo telemetry</p>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <span key={status} className={`px-2 py-1 rounded-md text-xs font-bold ${STATUS_COLORS_BG[status] || 'bg-slate-100 text-slate-600'}`}>
              {count} {status}
            </span>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ThermalChart />

      {/* Heatmap */}
      <ThermalHeatmap />

      {/* Sensor table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Thermometer size={14} className="text-blue-600" />
            Sensor Detail View
          </h3>
          <Filter size={12} className="text-slate-400" />
          {/* Zone filter */}
          <select
            value={filterZone}
            onChange={e => setFilterZone(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-blue-400"
          >
            {zones.map(z => <option key={z}>{z}</option>)}
          </select>
          {/* Status filter */}
          <div className="flex gap-1">
            {STATUS_ORDER.map(s => (
              <button key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors
                  ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {s}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-slate-400 mono">{filtered.length} sensors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                {['Sensor ID', 'Zone', 'Temperature', 'Humidity', 'Airflow', 'Power Load', 'Status'].map(h => (
                  <th key={h} className="text-left text-slate-500 font-semibold pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 30).map(s => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-2 pr-4 mono font-bold text-slate-900">{s.id}</td>
                  <td className="py-2 pr-4 text-slate-600">{s.zone}</td>
                  <td className="py-2 pr-4">
                    <span className={`font-bold mono ${s.temperature > 35 ? 'text-red-600' : s.temperature > 30 ? 'text-orange-500' : 'text-slate-900'}`}>
                      {s.temperature}°C
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-slate-600 mono">{s.humidity}%</td>
                  <td className="py-2 pr-4 text-slate-600 mono">{s.airflow}%</td>
                  <td className="py-2 pr-4 text-slate-600 mono">{s.powerLoad}%</td>
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS_BG[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 30 && (
            <p className="text-xs text-slate-400 text-center mt-3">Showing 30 of {filtered.length} sensors</p>
          )}
        </div>
      </div>
    </div>
  );
}
