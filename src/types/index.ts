export interface Task {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'one-time';
  domain: 'learning' | 'work' | 'finance' | 'fun' | 'health';
  targetDurationMin: number;
  rewardPositive: number;
  penaltyNegative: number;
  xp: number;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'VeryHard';
  streakKey?: string;
  active: boolean;
  createdAt: string;
}

export interface Reward {
  id: string;
  title: string;
  costPositivePoints: number;
  icon: string;
  category: string;
  active: boolean;
}

export interface Punishment {
  id: string;
  title: string;
  clearsNegativePoints: number;
  xpBonus: number;
  difficulty: 'Easy' | 'Normal' | 'Hard';
  icon: string;
  category: string;
  active: boolean;
}

export interface Session {
  id: string;
  taskId: string;
  taskTitle: string;
  startTime: string;
  endTime?: string;
  durationMin: number;
  completed: boolean;
  rewardClaimed: number;
  penaltyApplied: number;
  xpEarned: number;
  notes?: string;
}

export interface DailyScore {
  date: string;
  positivePoints: number;
  negativePoints: number;
  netScore: number;
  totalXpEarned: number;
  tasksCompleted: number;
  tasksFailed: number;
  punishmentsDone: number;
}

export interface PlayerStats {
  level: number;
  totalXp: number;
  nextLevelXp: number;
  lifetimePositivePoints: number;
  lifetimeNegativePoints: number;
  currentPositiveBalance: number;
  currentNegativeBalance: number;
  penaltyDeadline?: string;
  activeStreaks: Record<string, number>;
  timezone: string;
}

export interface WeeklyBoss {
  bossName: string;
  week: string;
  hp: number;
  currentDamage: number;
  requirements: BossRequirement[];
  rewardOnDefeat: BossReward;
  defeated: boolean;
}

export interface BossRequirement {
  task: string;
  damage: number;
  completed: boolean;
}

export interface BossReward {
  xp: number;
  positivePoints: number;
  loot?: string;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  taskId: string | null;
  taskTitle: string;
  startTime: string | null;
  elapsedSeconds: number;
  targetSeconds: number;
}

// Goals
export interface Goal {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  targetDate: string; // Jalali date: 1404/07/20
  completed: boolean;
  completedAt?: string;
  domain: 'learning' | 'work' | 'finance' | 'fun' | 'health' | 'personal';
  description?: string;
  createdAt: string;
}

// Checklist Items (Todo)
export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // Jalali date: 1404/07/20
  dueTime?: string; // 14:30
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: string;
  reminder?: boolean;
  reminderTime?: string; // ISO format for notification
  tags: string[];
  createdAt: string;
}

