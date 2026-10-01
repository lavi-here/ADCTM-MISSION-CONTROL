// Mock sensor data for 124 thermal sensors across the data center
// Each sensor represents a real measurement point in rack clusters

const ZONES = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3'];
const ZONE_NAMES = {
  A1: 'Rack Cluster A1', A2: 'Rack Cluster A2', A3: 'Rack Cluster A3',
  B1: 'Rack Cluster B1', B2: 'Rack Cluster B2', B3: 'Rack Cluster B3',
  C1: 'Rack Cluster C1', C2: 'Rack Cluster C2', C3: 'Rack Cluster C3',
  D1: 'Rack Cluster D1', D2: 'Rack Cluster D2', D3: 'Rack Cluster D3',
};

function getStatus(temp) {
  if (temp < 22) return 'COOL';
  if (temp < 27) return 'NORMAL';
  if (temp < 32) return 'WARM';
  if (temp < 37) return 'HOT';
  return 'CRITICAL';
}

function generateSensor(index) {
  const zone = ZONES[index % ZONES.length];
  // Introduce variation: some zones run hotter
  const zoneBase = { A1: 20, A2: 22, A3: 24, B1: 26, B2: 28, B3: 31, C1: 23, C2: 25, C3: 29, D1: 21, D2: 27, D3: 33 };
  const base = zoneBase[zone] || 25;
  const temp = parseFloat((base + (Math.random() * 6 - 3)).toFixed(1));
  return {
    id: `T-${String(index + 1).padStart(3, '0')}`,
    zone,
    zoneName: ZONE_NAMES[zone],
    temperature: temp,
    humidity: Math.floor(35 + Math.random() * 30),
    airflow: Math.floor(45 + Math.random() * 50),
    powerLoad: Math.floor(50 + Math.random() * 45),
    status: getStatus(temp),
    timestamp: new Date().toISOString(),
  };
}

export const initialSensors = Array.from({ length: 124 }, (_, i) => generateSensor(i));

export function updateSensors(sensors, scenarioActive = false, scenarioPeak = false) {
  return sensors.map((s) => {
    let delta = (Math.random() - 0.5) * 0.8;
    // During scenario, zone B3 heats up
    if (scenarioActive && s.zone === 'B3') {
      delta = scenarioPeak ? (Math.random() * 0.5 - 1.5) : (Math.random() * 1.5 + 0.5);
    }
    const temp = parseFloat(Math.min(42, Math.max(18, s.temperature + delta)).toFixed(1));
    return { ...s, temperature: temp, status: getStatus(temp), timestamp: new Date().toISOString() };
  });
}

// Cooling zones
export const initialCoolingZones = [
  { id: 'A', name: 'Zone A', label: 'Rack Cluster A', cooling: 72, status: 'Stable', color: 'blue' },
  { id: 'B', name: 'Zone B', label: 'Rack Cluster B', cooling: 89, status: 'High Load', color: 'orange' },
  { id: 'C', name: 'Zone C', label: 'Rack Cluster C', cooling: 55, status: 'Optimal', color: 'teal' },
  { id: 'D', name: 'Zone D', label: 'Rack Cluster D', cooling: 94, status: 'Pre-emptive Cooling', color: 'cyan' },
];

// Initial thermal chart data (last 20 points)
export function generateThermalHistory() {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => {
    const setpoint = 27;
    const active = parseFloat((25 + Math.sin(i * 0.4) * 2 + Math.random() * 0.5).toFixed(1));
    const predicted = parseFloat((active + 0.5 + Math.random() * 0.8).toFixed(1));
    return {
      time: new Date(now - (19 - i) * 3000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      setpoint,
      active,
      predicted,
    };
  });
}

// Analytics mock data
export const analyticsData = {
  coolingEnergy: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    traditional: Math.floor(4200 + Math.random() * 600),
    adctm: Math.floor(3100 + Math.random() * 400),
  })),
  pue: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    traditional: parseFloat((1.8 + Math.random() * 0.3).toFixed(2)),
    adctm: parseFloat((1.4 + Math.random() * 0.15).toFixed(2)),
  })),
  incidents: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    traditional: Math.floor(8 + Math.random() * 12),
    adctm: Math.floor(1 + Math.random() * 3),
  })),
  efficiency: Array.from({ length: 20 }, (_, i) => ({
    time: `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    efficiency: parseFloat((80 + Math.sin(i * 0.3) * 8 + Math.random() * 4).toFixed(1)),
  })),
};

// PPO state labels
export const ppoState = {
  inputs: ['Temperature', 'Humidity', 'Airflow', 'Power Load', 'Workload'],
  actions: ['Cooling Level', 'Fan Speed', 'Chiller Load'],
  rewards: ['Thermal Stability', 'PUE Improvement', 'Energy Efficiency'],
};

// Initial event log
export const initialEvents = [
  { id: 1, time: '21:28:11', severity: 'SUCCESS', icon: 'check', message: 'Environment handshake secure — telemetry bridge online' },
  { id: 2, time: '21:28:15', severity: 'INFO', icon: 'info', message: 'PPO Agent initialized — policy v3.2 loaded' },
  { id: 3, time: '21:28:18', severity: 'INFO', icon: 'cpu', message: 'State vector updated — 124 sensors nominal' },
  { id: 4, time: '21:28:25', severity: 'WARNING', icon: 'alert', message: 'Latency detected in Zone B3 telemetry stream' },
  { id: 5, time: '21:28:31', severity: 'INFO', icon: 'zap', message: 'Pre-emptive cooling triggered in Zone B' },
  { id: 6, time: '21:28:45', severity: 'SUCCESS', icon: 'check', message: 'Thermal stabilization confirmed — Zone A' },
];

export { getStatus, ZONE_NAMES };
