import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ShoppingBag, Plus, Trash2, X } from 'lucide-react';

export default function RewardShop() {
  const { rewards, player, purchaseReward, addReward, deleteReward } = useGameStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    costPositivePoints: 50,
    icon: '🎁',
    category: 'entertainment',
  });

  const activeRewards = rewards.filter((r) => r.active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReward(formData);
    setFormData({
      title: '',
      costPositivePoints: 50,
      icon: '🎁',
      category: 'entertainment',
    });
    setShowForm(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          فروشگاه پاداش
        </h2>
        <div className="flex items-center gap-3">
          <div className="bg-positive/20 border border-positive/30 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-400">موجودی: </span>
            <span className="text-positive font-bold text-lg">
              {player.currentPositiveBalance}
            </span>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
          >
            <Plus className="w-4 h-4" />
            پاداش جدید
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4 bg-gray-900/50 rounded-lg p-4 border border-primary/30">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">پاداش جدید</h3>
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
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">قیمت</label>
                <input
                  type="number"
                  value={formData.costPositivePoints}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      costPositivePoints: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">ایموجی</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">دسته</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value="entertainment">سرگرمی</option>
                  <option value="food">خوراکی</option>
                  <option value="treat">لذت</option>
                  <option value="shopping">خرید</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-purple-600 text-white font-bold py-2 rounded-lg transition-all text-sm"
            >
              افزودن پاداش
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeRewards.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-400">
            <p>هنوز پاداشی نداری! یکی اضافه کن 🎁</p>
          </div>
        ) : (
          activeRewards.map((reward) => {
            const canAfford = player.currentPositiveBalance >= reward.costPositivePoints;

            return (
              <div
                key={reward.id}
                className={`bg-gray-900/70 border rounded-lg p-4 transition-all ${
                  canAfford
                    ? 'border-positive/50 hover:border-positive'
                    : 'border-gray-600 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{reward.icon}</span>
                    <div>
                      <h3 className="font-bold">{reward.title}</h3>
                      <p className="text-xs text-gray-400">{reward.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (
                        window.confirm('مطمئنی می‌خوای این پاداش رو حذف کنی?')
                      ) {
                        deleteReward(reward.id);
                      }
                    }}
                    className="p-1 hover:bg-gray-700 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-negative" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-positive font-bold text-lg">
                    {reward.costPositivePoints} امتیاز
                  </div>
                  <button
                    onClick={() => purchaseReward(reward.id)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                      canAfford
                        ? 'bg-positive hover:bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'خرید' : 'ناموجود'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}