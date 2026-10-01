import React from 'react';
import CoolingControl from '../components/CoolingControl';

export default function CoolingPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-bold text-slate-900 text-xl">Cooling Control</h2>
        <p className="text-slate-500 text-sm">Autonomous cooling infrastructure management · Simulation only</p>
      </div>
      <CoolingControl />
    </div>
  );
}
