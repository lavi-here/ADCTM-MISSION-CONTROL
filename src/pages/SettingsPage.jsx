import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save } from 'lucide-react';

export default function SettingsPage() {
  const { settings, setSettings, isLive, setIsLive, speed, setSpeed, autonomousMode, setAutonomousMode } = useApp();

  function update(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="font-bold text-slate-900 text-xl flex items-center gap-2">
          <Settings size={20} className="text-blue-600" />
          System Settings
        </h2>
        <p className="text-slate-500 text-sm">Prototype configuration — all values are demo parameters</p>
      </div>

      {/* Thermal thresholds */}
      <SettingSection title="Thermal Thresholds" desc="Temperature limits for alerting and action">
        <SettingRow label="Warning Temperature (°C)" desc="Triggers warning alert">
          <NumberInput value={settings.tempWarning} min={28} max={40} onChange={v => update('tempWarning', v)} />
        </SettingRow>
        <SettingRow label="Critical Temperature (°C)" desc="Triggers emergency response">
          <NumberInput value={settings.tempCritical} min={32} max={45} onChange={v => update('tempCritical', v)} />
        </SettingRow>
      </SettingSection>

      {/* AI settings */}
      <SettingSection title="AI Agent Configuration" desc="PPO agent simulation parameters">
        <SettingRow label="AI Confidence Threshold (%)" desc="Minimum confidence to act autonomously">
          <div className="flex items-center gap-3">
            <input type="range" min={60} max={99} value={settings.confidenceThreshold}
              onChange={e => update('confidenceThreshold', Number(e.target.value))}
              className="flex-1 accent-blue-600" />
            <span className="mono font-bold text-blue-600 w-10 text-right">{settings.confidenceThreshold}%</span>
          </div>
        </SettingRow>
        <SettingRow label="Autonomous Control Mode" desc="Allow AI to execute cooling actions">
          <Toggle
            value={autonomousMode}
            onChange={setAutonomousMode}
            onLabel="ENABLED" offLabel="DISABLED"
          />
        </SettingRow>
      </SettingSection>

      {/* Simulation settings */}
      <SettingSection title="Simulation Mode" desc="Demo telemetry configuration">
        <SettingRow label="Live Simulation" desc="Enable real-time data updates">
          <Toggle value={isLive} onChange={setIsLive} onLabel="LIVE" offLabel="PAUSED" />
        </SettingRow>
        <SettingRow label="Simulation Speed" desc="Telemetry refresh rate">
          <div className="flex gap-2">
            {['slow', 'normal', 'fast'].map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors
                  ${speed === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {s}
              </button>
            ))}
          </div>
        </SettingRow>
        <SettingRow label="Telemetry Refresh" desc="Simulated update interval">
          <span className="mono text-slate-900 font-bold text-sm">
            {speed === 'slow' ? '4s' : speed === 'normal' ? '2s' : '0.8s'}
          </span>
        </SettingRow>
      </SettingSection>

      {/* Alerts */}
      <SettingSection title="Alert Preferences" desc="Notification configuration">
        <SettingRow label="Thermal Alerts" desc="Alerts for temperature threshold breaches">
          <Toggle value={settings.alertThermal} onChange={v => update('alertThermal', v)} />
        </SettingRow>
        <SettingRow label="AI Confidence Alerts" desc="Alerts when confidence drops below threshold">
          <Toggle value={settings.alertAI} onChange={v => update('alertAI', v)} />
        </SettingRow>
      </SettingSection>

      {/* Save button */}
      <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm">
        <Save size={14} />
        Save Settings
      </button>

      <div className="text-xs text-slate-400 p-3 rounded-lg bg-slate-50 border border-slate-200">
        ⓘ These settings control the prototype simulation only. No physical hardware is configured or affected.
        For production deployment, settings would integrate with PostgreSQL configuration store and InfluxDB telemetry.
      </div>
    </div>
  );
}

function SettingSection({ title, desc, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-800">{label}</div>
        {desc && <div className="text-xs text-slate-500 mt-0.5">{desc}</div>}
      </div>
      <div className="flex-shrink-0 min-w-[160px] flex justify-end">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange, onLabel = 'ON', offLabel = 'OFF' }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all
        ${value ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
      <div className={`w-8 h-4 rounded-full transition-colors relative ${value ? 'bg-emerald-400' : 'bg-slate-300'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      {value ? onLabel : offLabel}
    </button>
  );
}

function NumberInput({ value, min, max, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-lg leading-none">
        −
      </button>
      <span className="mono font-bold text-slate-900 w-10 text-center">{value}°C</span>
      <button onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-lg leading-none">
        +
      </button>
    </div>
  );
}
