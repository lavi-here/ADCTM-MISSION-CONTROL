import React from 'react';
import AICortexPanel from '../components/AICortexPanel';
import PPOVisualization from '../components/PPOVisualization';
import RewardFeedback from '../components/RewardFeedback';
import { useApp } from '../context/AppContext';
import { Brain, Zap } from 'lucide-react';

export default function CortexPage() {
  const { confidence, aiAction, scenario, runScenario } = useApp();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-xl flex items-center gap-2">
            <Brain size={20} className="text-cyan-600" />
            AI Cortex
          </h2>
          <p className="text-slate-500 text-sm">PPO Actor-Critic autonomous decision system · Simulation</p>
        </div>
        <button
          onClick={runScenario}
          disabled={scenario.active}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
            ${scenario.active ? 'bg-orange-100 text-orange-600 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm'}`}
        >
          <Zap size={14} />
          {scenario.active ? 'Scenario Running...' : 'Run AI Scenario Demo'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-1">
          <AICortexPanel />
        </div>
        <div className="col-span-2">
          <PPOVisualization />
        </div>
      </div>

      <RewardFeedback />
    </div>
  );
}
