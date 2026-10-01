import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ThermalPage from './pages/ThermalPage';
import CortexPage from './pages/CortexPage';
import CoolingPage from './pages/CoolingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import EventsPage from './pages/EventsPage';
import SettingsPage from './pages/SettingsPage';

function AppShell() {
  const [page, setPage] = useState('landing');

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'thermal': return <ThermalPage />;
      case 'cortex': return <CortexPage />;
      case 'cooling': return <CoolingPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'events': return <EventsPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  if (page === 'landing') {
    return <LandingPage onEnter={() => setPage('dashboard')} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activePage={page} onNavigate={setPage} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onNavigate={setPage} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
