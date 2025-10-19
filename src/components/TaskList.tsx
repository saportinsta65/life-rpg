import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ListTodo, Flame, Edit2, Trash2, Plus } from 'lucide-react';
import TaskForm from './TaskForm';

export default function TaskList() {
  const { tasks, player, deleteTask } = useGameStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const activeTasks = tasks.filter((t) => t.active);

  const getDomainIcon = (domain: string) => {
    const icons: Record<string, string> = {
      learning: '📚',
      work: '💼',
      health: '❤️',
      finance: '💰',
      fun: '🎮',
    };
    return icons[domain] || '📋';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: 'text-green-400',
      Normal: 'text-blue-400',
      Hard: 'text-orange-400',
      VeryHard: 'text-red-400',
    };
    return colors[difficulty] || 'text-gray-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-primary" />
          تسک‌های من
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
        >
          <Plus className="w-4 h-4" />
          تسک جدید
        </button>
      </div>

      {showForm && (
        <div className="mb-4 bg-gray-900/50 rounded-lg p-4 border border-primary/30">
          <TaskForm
            taskId={editingTask || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        </div>
      )}

      <div className="space-y-3">
        {activeTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>هنوز تسکی نداری! یکی اضافه کن 🚀</p>
          </div>
        ) : (
          activeTasks.map((task) => {
            const streak = player.activeStreaks[task.streakKey || ''] || 0;
            return (
              <div
                key={task.id}
                className="bg-gray-900/70 border border-gray-600 rounded-lg p-4 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getDomainIcon(task.domain)}</span>
                    <div>
                      <h3 className="font-bold text-lg">{task.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <span className={getDifficultyColor(task.difficulty)}>
                          {task.difficulty}
                        </span>
                        <span>•</span>
                        <span>{task.targetDurationMin} دقیقه</span>
                        {streak > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-streak">
                              <Flame className="w-4 h-4" />
                              {streak} روز
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingTask(task.id);
                        setShowForm(true);
                      }}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('مطمئنی می‌خوای این تسک رو حذف کنی?')) {
                          deleteTask(task.id);
                        }
                      }}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-negative" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-gray-800 rounded px-3 py-2 text-center">
                    <div className="text-gray-400 text-xs">XP</div>
                    <div className="text-xp font-bold">+{task.xp}</div>
                  </div>
                  <div className="bg-gray-800 rounded px-3 py-2 text-center">
                    <div className="text-gray-400 text-xs">پاداش</div>
                    <div className="text-positive font-bold">
                      +{task.rewardPositive}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded px-3 py-2 text-center">
                    <div className="text-gray-400 text-xs">جریمه</div>
                    <div className="text-negative font-bold">
                      {task.penaltyNegative}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}