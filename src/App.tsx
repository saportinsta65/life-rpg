import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import RewardShop from './components/RewardShop';
import PunishmentArena from './components/PunishmentArena';
import WeeklyBoss from './components/WeeklyBoss';
import Stats from './components/Stats';
import Goals from './components/Goals';
import Checklist from './components/Checklist';
import { Gamepad2 } from 'lucide-react';

type Tab = 'dashboard' | 'tasks' | 'timer' | 'rewards' | 'punishments' | 'boss' | 'stats' | 'goals' | 'checklist';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard' as Tab, label: '🏠 داشبورد' },
    { id: 'timer' as Tab, label: '⏱️ تایمر' },
    { id: 'goals' as Tab, label: '🎯 اهداف' },
    { id: 'checklist' as Tab, label: '✅ چک‌لیست' },
    { id: 'tasks' as Tab, label: '📋 تسک‌ها' },
    { id: 'rewards' as Tab, label: '🛒 پاداش‌ها' },
    { id: 'punishments' as Tab, label: '⚔️ تنبیه‌ها' },
    { id: 'boss' as Tab, label: '👹 باس هفتگی' },
    { id: 'stats' as Tab, label: '📊 آمار' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Life RPG</h1>
                <p className="text-sm text-gray-400">بازی زندگی من</p>
              </div>
            </div>
            <div className="hidden md:block text-sm text-gray-400">
              👤 capitantraderfx-creator
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'timer' && <Timer />}
          {activeTab === 'goals' && <Goals />}
          {activeTab === 'checklist' && <Checklist />}
          {activeTab === 'tasks' && <TaskList />}
          {activeTab === 'rewards' && <RewardShop />}
          {activeTab === 'punishments' && <PunishmentArena />}
          {activeTab === 'boss' && <WeeklyBoss />}
          {activeTab === 'stats' && <Stats />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
          <p>ساخته شده با ❤️ برای زندگی بهتر • Life RPG v1.0.0</p>
          <p className="text-xs mt-2 text-gray-500">
            تاریخ: {new Date().toLocaleDateString('fa-IR')} • 
            ساعت: {new Date().toLocaleTimeString('fa-IR')}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;