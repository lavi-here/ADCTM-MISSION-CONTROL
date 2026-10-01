import React, { useState } from 'react';
import { Wind, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ZONE_COLORS = {
  blue: { bar: 'from-blue-400 to-blue-600', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  orange: { bar: 'from-orange-400 to-orange-600', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  teal: { bar: 'from-teal-400 to-teal-600', badge: 'bg-teal-50 text-teal-700 border-teal-200' },
  cyan: { bar: 'from-cyan-400 to-cyan-600', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
};

function CoolingZoneCard({ zone, autonomous }) {
  const colors = ZONE_COLORS[zone.color] || ZONE_COLORS.blue;
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold text-slate-900 text-sm">{zone.name}</div>
          <div className="text-slate-500 text-xs">{zone.label}</div>
        </div>
        <div className={`px-2 py-0.5 rounded border text-xs font-medium ${colors.badge}`}>
          {zone.status}
        </div>
      </div>

      {/* Cooling gauge */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-500">Cooling Level</span>
          <span className="font-bold text-slate-900 mono">{zone.cooling}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-700`}
            style={{ width: `${zone.cooling}%` }}
          />
        </div>
      </div>

      {/* Mode indicator */}
      <div className="flex items-center gap-2 text-xs">
        {autonomous ? (
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle size={10} /> AI Controlled
          </span>
        ) : (
          <span className="flex items-center gap-1 text-orange-600">
            <AlertTriangle size={10} /> Manual Mode
          </span>
        )}
      </div>
    </div>
  );
}

export default function CoolingControl() {
  const { coolingZones, autonomousMode, setAutonomousMode } = useApp();
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  function handleOverrideConfirm() {
    setAutonomousMode(false);
    setShowOverrideModal(false);
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-base">Autonomous Cooling Control</h2>
          <p className="text-slate-500 text-xs mt-0.5">AI-managed cooling infrastructure · Simulation only</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Autonomous toggle */}
          <button
            onClick={() => autonomousMode ? setShowOverrideModal(true) : setAutonomousMode(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
          >
            {autonomousMode
              ? <ToggleRight size={20} className="text-emerald-500" />
              : <ToggleLeft size={20} className="text-slate-400" />}
            <span>Autonomous Control: <strong className={autonomousMode ? 'text-emerald-600' : 'text-slate-500'}>
              {autonomousMode ? 'ON' : 'OFF'}
            </strong></span>
          </button>

          {/* Manual override button */}
          <button
            onClick={() => setShowOverrideModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <AlertTriangle size={14} />
            MANUAL OVERRIDE
          </button>
        </div>
      </div>

      {/* Zone cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {coolingZones.map(zone => (
          <CoolingZoneCard key={zone.id} zone={zone} autonomous={autonomousMode} />
        ))}
      </div>

      {/* Safety guardrails */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Safety Guardrails</h3>
          <span className="ml-auto text-xs text-slate-400">Prototype safety layer simulation</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Guardrail checks */}
          <div className="space-y-2.5">
            {[
              'Thermal threshold enforcement',
              'Risk assessment filter',
              'Confidence threshold (≥80%)',
              'Manual override available',
              'Event logging active',
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5 text-sm">
                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>

          {/* Thermal limits */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 mb-2">Thermal Thresholds</div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-sm bg-emerald-400" />
              <span className="text-xs text-slate-600">Safe Range</span>
              <span className="text-xs font-bold text-slate-900 mono ml-auto">18°C — 35°C</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-sm bg-amber-400" />
              <span className="text-xs text-slate-600">Warning</span>
              <span className="text-xs font-bold text-amber-700 mono ml-auto">35°C — 38°C</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-sm bg-red-500" />
              <span className="text-xs text-slate-600">Critical</span>
              <span className="text-xs font-bold text-red-700 mono ml-auto">&gt; 38°C</span>
            </div>

            {/* Bar visual */}
            <div className="mt-3 h-4 rounded-full overflow-hidden flex">
              <div className="flex-1 bg-emerald-200 flex items-center justify-center text-[9px] text-emerald-700 font-bold">SAFE</div>
              <div className="w-8 bg-amber-300 flex items-center justify-center text-[9px] text-amber-800 font-bold">WRN</div>
              <div className="w-6 bg-red-400 flex items-center justify-center text-[9px] text-red-100 font-bold">!</div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mono">
              <span>18°C</span><span>35°C</span><span>38°C</span><span>42°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md w-full mx-4 fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Manual Override Confirmation</h3>
                <p className="text-slate-500 text-sm">UI simulation only — no real hardware affected</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-5">
              Disabling autonomous control will transfer cooling decisions to manual operation. 
              The PPO agent will continue monitoring but will not execute actions automatically.
            </p>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 mb-5">
              ⚠ This is a prototype simulation. No physical infrastructure is controlled.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOverrideConfirm}
                className="flex-1 py-2.5 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 text-sm transition-colors"
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
