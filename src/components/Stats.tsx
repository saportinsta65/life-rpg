import React from 'react';
import { useGameStore } from '../store/gameStore';
import { BarChart3, Calendar, Award } from 'lucide-react';

export default function Stats() {
  const { dailyScores, sessions, player } = useGameStore();

  const last7Days = dailyScores.slice(-7);
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.completed).length;
  const successRate = totalSessions > 0 
    ? ((completedSessions / totalSessions) * 100).toFixed(0) 
    : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        آمار و ارقام
      </h2>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">جلسات کل</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">{totalSessions}</div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-positive" />
            <span className="text-gray-400 text-sm">نرخ موفقیت</span>
          </div>
          <div className="text-3xl font-bold text-positive">{successRate}%</div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-xp" />
            <span className="text-gray-400 text-sm">جلسات موفق</span>
          </div>
          <div className="text-3xl font-bold text-xp">{completedSessions}</div>
        </div>
      </div>

      {/* Last 7 Days */}
      <div>
        <h3 className="font-bold text-sm text-gray-400 mb-3">
          7 روز اخیر
        </h3>
        <div className="space-y-2">
          {last7Days.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              هنوز داده‌ای وجود نداره!
            </p>
          ) : (
            last7Days.map((day) => (
              <div
                key={day.date}
                className="bg-gray-900/50 rounded-lg p-3 border border-gray-600 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm">{day.date}</div>
                  <div className="text-xs text-gray-400">
                    {day.tasksCompleted} تسک موفق، {day.tasksFailed} ناموفق
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-xp font-bold">+{day.totalXpEarned}</div>
                    <div className="text-gray-500 text-xs">XP</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`font-bold ${
                        day.netScore >= 0 ? 'text-positive' : 'text-negative'
                      }`}
                    >
                      {day.netScore >= 0 ? '+' : ''}
                      {day.netScore}
                    </div>
                    <div className="text-gray-500 text-xs">امتیاز</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}