import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Play, Pause, Square, RotateCcw, Clock } from 'lucide-react';
import { formatTime } from '../utils/calculations';

export default function Timer() {
  const { timer, tasks, startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer } =
    useGameStore();
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [notes, setNotes] = useState('');

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const progress = timer.targetSeconds
    ? (timer.elapsedSeconds / timer.targetSeconds) * 100
    : 0;

  const handleStart = () => {
    if (!selectedTask) {
      alert('لطفاً یک تسک انتخاب کنید!');
      return;
    }
    startTimer(selectedTask.id, selectedTask.title, selectedTask.targetDurationMin);
  };

  const handleStop = (completed: boolean) => {
    if (window.confirm(completed ? 'تسک تکمیل شد؟' : 'تسک را متوقف می‌کنید?')) {
      stopTimer(completed, notes);
      setNotes('');
      setSelectedTaskId('');
    }
  };

  if (!timer.taskId) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary" />
          تایمر تسک
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              انتخاب تسک
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            >
              <option value="">-- انتخاب کنید --</option>
              {tasks
                .filter((t) => t.active)
                .map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title} ({task.targetDurationMin} دقیقه)
                  </option>
                ))}
            </select>
          </div>

          {selectedTask && (
            <div className="bg-gray-900/50 rounded-lg p-4 border border-primary/30">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">هدف: </span>
                  <span className="text-white font-bold">
                    {selectedTask.targetDurationMin} دقیقه
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">XP: </span>
                  <span className="text-xp font-bold">+{selectedTask.xp}</span>
                </div>
                <div>
                  <span className="text-gray-400">پاداش: </span>
                  <span className="text-positive font-bold">
                    +{selectedTask.rewardPositive}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">جریمه: </span>
                  <span className="text-negative font-bold">
                    {selectedTask.penaltyNegative}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={!selectedTask}
            className="w-full bg-primary hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            شروع تایمر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
      <h2 className="text-lg font-bold mb-6 text-center text-gray-400">
        در حال انجام: {timer.taskTitle}
      </h2>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-mono font-bold text-primary mb-2">
          {formatTime(timer.elapsedSeconds)}
        </div>
        <div className="text-sm text-gray-400">
          هدف: {formatTime(timer.targetSeconds)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              progress >= 100
                ? 'bg-positive'
                : progress >= 80
                ? 'bg-primary'
                : 'bg-xp'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="text-center text-sm text-gray-400 mt-2">
          {progress.toFixed(0)}% تکمیل شده
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">
          یادداشت (اختیاری)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="یادداشت‌های سریع..."
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary resize-none"
          rows={2}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {timer.isPaused ? (
          <button
            onClick={resumeTimer}
            className="bg-positive hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            ادامه
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Pause className="w-5 h-5" />
            توقف
          </button>
        )}

        <button
          onClick={resetTimer}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          ریست
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleStop(true)}
          className="bg-positive hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Square className="w-5 h-5" />
          تکمیل شد ✓
        </button>
        <button
          onClick={() => handleStop(false)}
          className="bg-negative hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Square className="w-5 h-5" />
          انصراف ✗
        </button>
      </div>

      {/* Estimated Rewards */}
      {progress >= 80 && (
        <div className="mt-4 bg-positive/10 border border-positive/30 rounded-lg p-3 text-center">
          <p className="text-sm text-positive font-bold">
            🎉 در صورت تکمیل: +{selectedTask?.xp || 0} XP و +
            {selectedTask?.rewardPositive || 0} امتیاز
          </p>
        </div>
      )}
    </div>
  );
}