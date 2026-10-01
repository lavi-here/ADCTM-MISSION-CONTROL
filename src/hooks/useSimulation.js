import { useState, useEffect, useRef, useCallback } from 'react';
import { updateSensors, generateThermalHistory } from '../data/mockData';

// Speed multipliers in ms
const SPEED_MAP = { slow: 4000, normal: 2000, fast: 800 };

export function useSimulation() {
  const [isLive, setIsLive] = useState(true);
  const [speed, setSpeed] = useState('normal');
  const [sensors, setSensors] = useState([]);
  const [thermalHistory, setThermalHistory] = useState([]);
  const [confidence, setConfidence] = useState(87);
  const [risk, setRisk] = useState('LOW');
  const [aiAction, setAiAction] = useState('COOLING_PULSE');
  const [coolingZones, setCoolingZones] = useState([]);
  const [kpis, setKpis] = useState({ efficiency: 85, safety: 98, activeZones: 12, powerLoad: 4.2 });
  const [scenario, setScenario] = useState({ active: false, step: 0, peak: false });
  const [events, setEvents] = useState([]);
  const intervalRef = useRef(null);

  // Scenario runner
  const runScenario = useCallback(() => {
    setScenario({ active: true, step: 0, peak: false });
  }, []);

  useEffect(() => {
    if (!scenario.active) return;
    const steps = [
      () => addEvent('INFO', 'Anomalous thermal rise detected in Zone B3 — initiating analysis'),
      () => addEvent('INFO', 'State vector updated — thermal gradient +2.3°C above baseline'),
      () => addEvent('WARNING', 'PPO Agent calculating cooling response — confidence 91%'),
      () => { setScenario(s => ({ ...s, peak: true })); addEvent('WARNING', 'HEAT SPIKE PREDICTED — Zone B3 — Estimated in 38 seconds'); },
      () => { setConfidence(91); setAiAction('EMERGENCY_COOLING'); addEvent('WARNING', 'AI Action: Emergency cooling pulse dispatched to Zone B'); },
      () => { setCoolingZones(z => z.map(zone => zone.id === 'B' ? { ...zone, cooling: 97, status: 'Emergency Cooling' } : zone)); addEvent('INFO', 'Cooling infrastructure responding — Zone B cooling elevated to 97%'); },
      () => { setScenario(s => ({ ...s, peak: false })); addEvent('INFO', 'Thermal descent confirmed — Zone B3 temperature falling'); },
      () => { setAiAction('COOLING_PULSE'); setConfidence(89); addEvent('SUCCESS', 'Thermal stabilization achieved — Zone B3 normalizing'); },
      () => { setCoolingZones(z => z.map(zone => zone.id === 'B' ? { ...zone, cooling: 82, status: 'Stabilizing' } : zone)); addEvent('SUCCESS', 'Simulated reward calculated — PPO policy update applied (+7.4%)'); },
      () => { setScenario({ active: false, step: 0, peak: false }); addEvent('SUCCESS', 'AI Scenario complete — continuous learning cycle updated'); },
    ];
    if (scenario.step < steps.length) {
      const t = setTimeout(() => {
        steps[scenario.step]();
        setScenario(s => ({ ...s, step: s.step + 1 }));
      }, scenario.step === 0 ? 100 : 2500);
      return () => clearTimeout(t);
    }
  }, [scenario]);

  const addEvent = (severity, message) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setEvents(prev => [{ id: Date.now(), time, severity, message }, ...prev].slice(0, 50));
  };

  // Main tick
  useEffect(() => {
    if (!isLive) return;
    const interval = SPEED_MAP[speed];
    intervalRef.current = setInterval(() => {
      // Update sensors
      setSensors(prev => {
        if (prev.length === 0) return prev;
        return updateSensors(prev, scenario.active, scenario.peak);
      });

      // Update thermal history
      setThermalHistory(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const setpoint = 27;
        const active = parseFloat(Math.min(36, Math.max(22, last.active + (Math.random() - 0.48) * 0.6 + (scenario.peak ? 0.5 : 0))).toFixed(1));
        const predicted = parseFloat(Math.min(38, Math.max(22, active + 0.4 + Math.random() * 0.5)).toFixed(1));
        const newPoint = {
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          setpoint,
          active,
          predicted,
        };
        return [...prev.slice(-29), newPoint];
      });

      // Update KPIs
      setKpis(prev => ({
        efficiency: Math.min(99, Math.max(75, prev.efficiency + (Math.random() - 0.5) * 1.2)),
        safety: Math.min(100, Math.max(85, prev.safety + (Math.random() - 0.5) * 0.8)),
        activeZones: prev.activeZones,
        powerLoad: parseFloat(Math.max(3.8, Math.min(5.0, prev.powerLoad + (Math.random() - 0.5) * 0.1)).toFixed(1)),
      }));

      // Update confidence
      setConfidence(prev => Math.min(98, Math.max(75, prev + (Math.random() - 0.5) * 3)));

      // Occasionally add info events
      if (Math.random() < 0.15) {
        const msgs = [
          ['INFO', 'Telemetry packets streaming — 124 sensors nominal'],
          ['INFO', 'PPO policy gradient updated — batch #2847'],
          ['INFO', 'State representation refreshed — thermal vector computed'],
          ['SUCCESS', 'Cooling efficiency target maintained'],
          ['INFO', 'DCIM/BMS bridge heartbeat — latency 12ms'],
        ];
        const [sev, msg] = msgs[Math.floor(Math.random() * msgs.length)];
        addEvent(sev, msg);
      }
    }, interval);
    return () => clearInterval(intervalRef.current);
  }, [isLive, speed, scenario.active, scenario.peak]);

  return {
    isLive, setIsLive,
    speed, setSpeed,
    sensors, setSensors,
    thermalHistory, setThermalHistory,
    confidence: Math.round(confidence),
    risk,
    aiAction,
    coolingZones, setCoolingZones,
    kpis,
    events, setEvents, addEvent,
    scenario,
    runScenario,
  };
}
