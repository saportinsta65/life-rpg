import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Swords, Plus, Trash2, X, Clock } from 'lucide-react';

export default function PunishmentArena() {
  const { punishments, player, completePunishment, addPunishment, deletePunishment } =
    useGameStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clearsNegativePoints: 10,
    xpBonus: 20,
    difficulty: 'Normal' as 'Easy' | 'Normal' | 'Hard',
    icon: '⚔️',
    category: 'physical',
  });

  const activePunishments = punishments.filter((p) => p.active);
  const hasNegativePoints = player.currentNegativeBalance < 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPunishment(formData);
    setFormData({
      title: '',
      clearsNegativePoints: 10,
      xpBonus: 20,
      difficulty: 'Normal',
      icon: '⚔️',
      category: 'physical',
    });
    setShowForm(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Swords className="w-6 h-6 text-negative" />
          آرنای تنبیه
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-negative hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
        >
          <Plus className="w-4 h-4" />
          تنبیه جدید
        </button>
      </div>

      {hasNegativePoints && (
        <div className="mb-4 bg-negative/10 border border-negative/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-negative text-lg">
                امتیاز منفی فعلی: {player.currentNegativeBalance}
              </h3>
              <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4" />
                باید ظرف 48 ساعت پاک بشه!
              </p>
            </div>
            <div className="text-orange-400 text-2xl animate-pulse">⚠️</div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-4 bg-gray-900/50 rounded-lg p-4 border border-negative/30">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">تنبیه جدید</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">عنوان</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-negative"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">دشواری</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as 'Easy' | 'Normal' | 'Hard',
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-negative"
                >
                  <option value="Easy">آسان</option>
                  <option value="Normal">عادی</option>
                  <option value="Hard">سخت</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  پاک‌سازی
                </label>
                <input
                  type="number"
                  value={formData.clearsNegativePoints}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clearsNegativePoints: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-negative"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">XP بونوس</label>
                <input
                  type="number"
                  value={formData.xpBonus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      xpBonus: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-negative"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">ایموجی</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-negative"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-negative hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-all text-sm"
            >
              افزودن تنبیه
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activePunishments.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-400">
            <p>هنوز تنبیهی نداری! یکی اضافه کن ⚔️</p>
          </div>
        ) : (
          activePunishments.map((punishment) => {
            const getDifficultyColor = (diff: string) => {
              return diff === 'Easy'
                ? 'text-green-400'
                : diff === 'Normal'
                ? 'text-yellow-400'
                : 'text-red-400';
            };

            return (
              <div
                key={punishment.id}
                className="bg-gray-900/70 border border-gray-600 rounded-lg p-4 hover:border-negative/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{punishment.icon}</span>
                    <div>
                      <h3 className="font-bold">{punishment.title}</h3>
                      <p
                        className={`text-xs ${getDifficultyColor(
                          punishment.difficulty
                        )}`}
                      >
                        {punishment.difficulty}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (
                        window.confirm('مطمئنی می‌خوای این تنبیه رو حذف کنی?')
                      ) {
                        deletePunishment(punishment.id);
                      }
                    }}
                    className="p-1 hover:bg-gray-700 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-negative" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="bg-gray-800 rounded px-3 py-2 text-center">
                    <div className="text-gray-400 text-xs">پاک می‌کنه</div>
                    <div className="text-positive font-bold">
                      -{punishment.clearsNegativePoints}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded px-3 py-2 text-center">
                    <div className="text-gray-400 text-xs">XP بونوس</div>
                    <div className="text-xp font-bold">
                      +{punishment.xpBonus}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => completePunishment(punishment.id)}
                  className="w-full bg-negative hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-all"
                >
                  ✓ انجام دادم
                </button>
              </div>
            );
          })
        )}
      </div>

      {!hasNegativePoints && (
        <div className="mt-4 bg-positive/10 border border-positive/30 rounded-lg p-4 text-center">
          <p className="text-positive font-bold">
            🎉 عالی! امتیاز منفی نداری!
          </p>
        </div>
      )}
    </div>
  );
}