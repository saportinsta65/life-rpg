import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { X } from 'lucide-react';

interface TaskFormProps {
  taskId?: string;
  onClose: () => void;
}

export default function TaskForm({ taskId, onClose }: TaskFormProps) {
  const { tasks, addTask, updateTask } = useGameStore();
  const editTask = tasks.find((t) => t.id === taskId);

  const [formData, setFormData] = useState({
    title: '',
    type: 'daily' as 'daily' | 'weekly' | 'one-time',
    domain: 'work' as 'learning' | 'work' | 'finance' | 'fun' | 'health',
    targetDurationMin: 60,
    rewardPositive: 10,
    penaltyNegative: -10,
    xp: 30,
    difficulty: 'Normal' as 'Easy' | 'Normal' | 'Hard' | 'VeryHard',
    streakKey: '',
  });

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title,
        type: editTask.type,
        domain: editTask.domain,
        targetDurationMin: editTask.targetDurationMin,
        rewardPositive: editTask.rewardPositive,
        penaltyNegative: editTask.penaltyNegative,
        xp: editTask.xp,
        difficulty: editTask.difficulty,
        streakKey: editTask.streakKey || '',
      });
    }
  }, [editTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editTask) {
      updateTask(editTask.id, formData);
    } else {
      addTask(formData);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">
          {editTask ? 'ویرایش تسک' : 'تسک جدید'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">عنوان تسک</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">نوع</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as 'daily' | 'weekly' | 'one-time',
              })
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="daily">روزانه</option>
            <option value="weekly">هفتگی</option>
            <option value="one-time">یک‌بار</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">حوزه</label>
          <select
            value={formData.domain}
            onChange={(e) =>
              setFormData({
                ...formData,
                domain: e.target.value as any,
              })
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="learning">📚 یادگیری</option>
            <option value="work">💼 کار</option>
            <option value="health">❤️ سلامتی</option>
            <option value="finance">💰 مالی</option>
            <option value="fun">🎮 تفریح</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            مدت زمان (دقیقه)
          </label>
          <input
            type="number"
            value={formData.targetDurationMin}
            onChange={(e) =>
              setFormData({
                ...formData,
                targetDurationMin: parseInt(e.target.value),
              })
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
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
                difficulty: e.target.value as any,
              })
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="Easy">آسان</option>
            <option value="Normal">عادی</option>
            <option value="Hard">سخت</option>
            <option value="VeryHard">خیلی سخت</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">XP</label>
          <input
            type="number"
            value={formData.xp}
            onChange={(e) =>
              setFormData({ ...formData, xp: parseInt(e.target.value) })
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">پاداش +</label>
          <input
            type="number"
            value={formData.rewardPositive}
            onChange={(e) =>
              setFormData({
                ...formData,
                rewardPositive: parseInt(e.target.value),
              })
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">جریمه -</label>
          <input
            type="number"
            value={formData.penaltyNegative}
            onChange={(e) =>
              setFormData({
                ...formData,
                penaltyNegative: parseInt(e.target.value),
              })
            }
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          کلید استریک (اختیاری)
        </label>
        <input
          type="text"
          value={formData.streakKey}
          onChange={(e) => setFormData({ ...formData, streakKey: e.target.value })}
          placeholder="مثال: daily:learning"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-all"
      >
        {editTask ? 'به‌روزرسانی' : 'افزودن تسک'}
      </button>
    </form>
  );
}