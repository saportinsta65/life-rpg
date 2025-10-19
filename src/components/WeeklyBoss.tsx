import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Skull, CheckCircle, XCircle } from 'lucide-react';

export default function WeeklyBoss() {
  const { weeklyBoss, initializeWeeklyBoss } = useGameStore();

  useEffect(() => {
    if (!weeklyBoss) {
      initializeWeeklyBoss();
    }
  }, [weeklyBoss, initializeWeeklyBoss]);

  if (!weeklyBoss) return null;

  const hpPercentage = Math.max(
    0,
    ((weeklyBoss.hp - weeklyBoss.currentDamage) / weeklyBoss.hp) * 100
  );

  return (
    <div className="bg-gradient-to-br from-red-900/20 to-purple-900/20 rounded-lg p-6 shadow-xl border-2 border-red-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skull className="w-8 h-8 text-red-400" />
          <div>
            <h2 className="text-2xl font-bold text-red-400">
              {weeklyBoss.bossName}
            </h2>
            <p className="text-sm text-gray-400">باس هفتگی {weeklyBoss.week}</p>
          </div>
        </div>
        {weeklyBoss.defeated && (
          <div className="bg-positive/20 border border-positive rounded-lg px-4 py-2">
            <span className="text-positive font-bold">✓ شکست خورده!</span>
          </div>
        )}
      </div>

      {/* HP Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">HP باس</span>
          <span className="text-red-400 font-bold">
            {Math.max(0, weeklyBoss.hp - weeklyBoss.currentDamage)} /{' '}
            {weeklyBoss.hp}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden border border-red-500/30">
          <div
            className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-500 flex items-center justify-center text-xs font-bold"
            style={{ width: `${hpPercentage}%` }}
          >
            {hpPercentage > 10 && `${hpPercentage.toFixed(0)}%`}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-3 mb-6">
        <h3 className="font-bold text-sm text-gray-400">شرایط شکست:</h3>
        {weeklyBoss.requirements.map((req, index) => (
          <div
            key={index}
            className={`bg-gray-900/50 rounded-lg p-3 border ${
              req.completed
                ? 'border-positive/50'
                : 'border-gray-600'
            } flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              {req.completed ? (
                <CheckCircle className="w-5 h-5 text-positive" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-500" />
              )}
              <span className={req.completed ? 'text-positive' : 'text-white'}>
                {req.task}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">آسیب: </span>
              <span className="text-red-400 font-bold">{req.damage}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards */}
      <div className="bg-xp/10 border border-xp/30 rounded-lg p-4">
        <h3 className="font-bold text-sm text-gray-400 mb-3">
          پاداش شکست باس:
        </h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <div className="text-xp font-bold text-lg">
              +{weeklyBoss.rewardOnDefeat.xp}
            </div>
            <div className="text-gray-400 text-xs">XP</div>
          </div>
          <div className="text-center">
            <div className="text-positive font-bold text-lg">
              +{weeklyBoss.rewardOnDefeat.positivePoints}
            </div>
            <div className="text-gray-400 text-xs">امتیاز</div>
          </div>
          <div className="text-center">
            <div className="text-primary font-bold text-lg">✨</div>
            <div className="text-gray-400 text-xs">Loot</div>
          </div>
        </div>
        {weeklyBoss.rewardOnDefeat.loot && (
          <div className="mt-3 text-center text-sm text-primary">
            {weeklyBoss.rewardOnDefeat.loot}
          </div>
        )}
      </div>

      {weeklyBoss.defeated && (
        <div className="mt-4 bg-positive/20 border border-positive rounded-lg p-3 text-center">
          <p className="text-positive font-bold">
            🎊 تبریک! باس رو شکست دادی! پاداش‌ها رو دریافت کردی!
          </p>
        </div>
      )}
    </div>
  );
}