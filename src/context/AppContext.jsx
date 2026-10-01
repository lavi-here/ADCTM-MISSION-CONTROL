import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSensors, initialCoolingZones, generateThermalHistory, initialEvents } from '../data/mockData';
import { useSimulation } from '../hooks/useSimulation';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const sim = useSimulation();
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [settings, setSettings] = useState({
    confidenceThreshold: 80,
    autonomousMode: true,
    telemetryRefresh: 1,
    alertThermal: true,
    alertAI: true,
    simulationMode: true,
    tempWarning: 35,
    tempCritical: 38,
  });
  const [activePage, setActivePage] = useState('landing');

  // Bootstrap data
  useEffect(() => {
    sim.setSensors(initialSensors);
    sim.setThermalHistory(generateThermalHistory());
    sim.setCoolingZones(initialCoolingZones);
    sim.setEvents(initialEvents);
  }, []);

  return (
    <AppContext.Provider value={{
      ...sim,
      autonomousMode, setAutonomousMode,
      settings, setSettings,
      activePage, setActivePage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
