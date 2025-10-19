import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Trophy, Zap, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export default function Dashboard() {
  const { player, dailyScores } = useGameStore();

  const todayScore = dailyScores.find(
    (ds) => ds.date === new Date().toISOString().split('T')[0]
  );

  const progressPercentage = (player.totalXp / player.nextLevelXp) * 100;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl">
            🎮
          </div>
          <div>
            <h2 className="text-xl font-bold">capitantraderfx-creator</h2>
            <p className="text-gray-400 text-sm">بازیکن حرفه‌ای زندگی</p>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center gap-2 text-3xl font-bold text-primary">
            <Trophy className="w-8 h-8" />
            <span>Level {player.level}</span>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">پیشرفت تا سطح بعد</span>
          <span className="text-xp font-bold">
            {player.totalXp} / {player.nextLevelXp} XP
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-xp to-yellow-300 h-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          >
            {progressPercentage >= 10 && (
              <span className="text-xs font-bold text-gray-900">
                {progressPercentage.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Positive Points */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-positive/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-positive" />
            <span className="text-gray-400 text-sm">امتیاز مثبت</span>
          </div>
          <div className="text-3xl font-bold text-positive">
            +{player.currentPositiveBalance}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            مجموع: {player.lifetimePositivePoints}
          </div>
        </div>

        {/* Negative Points */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-negative/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-negative" />
            <span className="text-gray-400 text-sm">امتیاز منفی</span>
          </div>
          <div className="text-3xl font-bold text-negative">
            {player.currentNegativeBalance}
          </div>
          {player.currentNegativeBalance < 0 && (
            <div className="text-xs text-orange-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>باید تا 48 ساعت پاک بشه!</span>
            </div>
          )}
        </div>

        {/* Today's Score */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-gray-400 text-sm">امتیاز امروز</span>
          </div>
          <div className="text-3xl font-bold text-primary">
            {todayScore?.netScore || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {todayScore?.tasksCompleted || 0} تسک تکمیل شده
          </div>
        </div>
      </div>

      {/* Active Streaks */}
      {Object.keys(player.activeStreaks).length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-streak/30">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            🔥 استریک‌های فعال
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(player.activeStreaks).map(([key, days]) => (
              <div
                key={key}
                className="bg-gray-900/50 px-3 py-2 rounded-lg flex items-center gap-2"
              >
                <span className="text-sm text-gray-300">
                  {key.split(':')[1]}
                </span>
                <span className="text-streak font-bold">🔥 {days} روز</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}