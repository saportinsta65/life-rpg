import { Task } from '../types';

export function calculateXP(
  task: Task,
  actualMinutes: number,
  streakDays: number
): number {
  const difficultyMultiplier = {
    Easy: 0.8,
    Normal: 1.0,
    Hard: 1.3,
    VeryHard: 1.7,
  };

  const timeFactor = actualMinutes / task.targetDurationMin;
  const streakBonus = 1 + 0.1 * Math.min(streakDays, 5);

  return Math.floor(
    task.xp * difficultyMultiplier[task.difficulty] * timeFactor * streakBonus
  );
}

export function calculateNextLevelXP(currentLevel: number): number {
  return 100 * currentLevel * currentLevel;
}

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} دقیقه`;
  if (mins === 0) return `${hours} ساعت`;
  return `${hours} ساعت و ${mins} دقیقه`;
}