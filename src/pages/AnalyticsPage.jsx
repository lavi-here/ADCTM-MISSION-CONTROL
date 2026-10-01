import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { analyticsData } from '../data/mockData';
import { TrendingDown, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

const COMPARISON = [
  { category: 'Response Time', traditional: 'Manual / Reactive', adctm: 'Real-Time / Predictive' },
  { category: 'Optimization', traditional: 'Rule-Based Logic', adctm: 'AI-Driven PPO' },
  { category: 'Learning', traditional: 'Static Configuration', adctm: 'Continuous Improvement' },
  { category: 'Predictive Capability', traditional: 'None', adctm: 'Heat Spike Prediction' },
  { category: 'Safety Layer', traditional: 'Manual Only', adctm: 'Autonomous + Manual Override' },
  { category: 'Energy Efficiency', traditional: 'Fixed Schedules', adctm: 'Dynamic Optimization' },
];

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-bold text-white">{p.value}{p.unit || ''}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('energy');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-xl">Analytics</h2>
          <p className="text-slate-500 text-sm">Simulated performance comparison · prototype metrics</p>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
          Demo Data · Not real measurements
        </span>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Energy Reduction" value="26%" trend="down" desc="vs. traditional cooling" color="emerald" />
        <SummaryCard label="PUE Improvement" value="+0.38" trend="up" desc="From 1.82 → 1.44" color="blue" />
        <SummaryCard label="Thermal Incidents" value="−78%" trend="down" desc="Fewer critical events" color="teal" />
        <SummaryCard label="Response Time" value="<1s" trend="up" desc="AI vs manual mins" color="purple" />
      </div>

      {/* Chart tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          {[
            { id: 'energy', label: 'Cooling Energy' },
            { id: 'pue', label: 'PUE Trend' },
            { id: 'incidents', label: 'Thermal Incidents' },
            { id: 'efficiency', label: 'Cooling Efficiency' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'energy' && (
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Cooling Energy Consumption (kWh)</h3>
            <p className="text-slate-500 text-xs mb-4">Traditional vs ADCTM — simulated annual comparison</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analyticsData.coolingEnergy} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Legend formatter={v => <span className="text-xs text-slate-600">{v}</span>} />
                <Bar dataKey="traditional" name="Traditional" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="adctm" name="ADCTM" fill="#2563eb" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'pue' && (
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Power Usage Effectiveness (PUE)</h3>
            <p className="text-slate-500 text-xs mb-4">Lower is better · target PUE ≤ 1.5</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={analyticsData.pue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[1.2, 2.2]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Legend formatter={v => <span className="text-xs text-slate-600">{v}</span>} />
                <Line dataKey="traditional" name="Traditional" stroke="#94a3b8" strokeWidth={2} dot={false} />
                <Line dataKey="adctm" name="ADCTM" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Thermal Incidents per Month</h3>
            <p className="text-slate-500 text-xs mb-4">Critical thermal events requiring intervention</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={analyticsData.incidents} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Legend formatter={v => <span className="text-xs text-slate-600">{v}</span>} />
                <Bar dataKey="traditional" name="Traditional" fill="#f87171" radius={[3, 3, 0, 0]} />
                <Bar dataKey="adctm" name="ADCTM" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'efficiency' && (
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Cooling Efficiency (%)</h3>
            <p className="text-slate-500 text-xs mb-4">Real-time efficiency with AI optimization</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={analyticsData.efficiency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Line dataKey="efficiency" name="Efficiency %" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Traditional Cooling vs ADCTM</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-slate-500 font-semibold pb-3 w-40">Capability</th>
                <th className="text-left text-slate-500 font-semibold pb-3 px-4">Traditional Cooling</th>
                <th className="text-left text-slate-500 font-semibold pb-3 px-4">ADCTM (AI-Driven)</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-semibold text-slate-900 text-xs">{row.category}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{row.traditional}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-emerald-700 text-xs font-medium">{row.adctm}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, trend, desc, color }) {
  const bg = { emerald: 'bg-emerald-50 border-emerald-200', blue: 'bg-blue-50 border-blue-200', teal: 'bg-teal-50 border-teal-200', purple: 'bg-purple-50 border-purple-200' };
  const text = { emerald: 'text-emerald-700', blue: 'text-blue-700', teal: 'text-teal-700', purple: 'text-purple-700' };
  const Icon = trend === 'down' ? TrendingDown : TrendingUp;
  return (
    <div className={`rounded-xl border p-4 ${bg[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={text[color]} />
        <span className="text-xs font-medium text-slate-600">{label}</span>
      </div>
      <div className={`text-3xl font-black ${text[color]} mb-1 mono`}>{value}</div>
      <div className="text-slate-500 text-xs">{desc}</div>
    </div>
  );
}
