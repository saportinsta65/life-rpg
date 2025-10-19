import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Task,
  Reward,
  Punishment,
  Session,
  DailyScore,
  PlayerStats,
  WeeklyBoss,
  TimerState,
  Goal,
  ChecklistItem,
} from '../types';
import { calculateXP, calculateNextLevelXP, getWeekNumber } from '../utils/calculations';

interface GameState {
  // Player
  player: PlayerStats;
  
  // Tasks, Rewards, Punishments
  tasks: Task[];
  rewards: Reward[];
  punishments: Punishment[];
  
  // Sessions & Scores
  sessions: Session[];
  dailyScores: DailyScore[];
  
  // Weekly Boss
  weeklyBoss: WeeklyBoss | null;
  
  // Timer
  timer: TimerState;
  
  // Goals & Checklist
  goals: Goal[];
  checklistItems: ChecklistItem[];
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'active'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Reward Actions
  addReward: (reward: Omit<Reward, 'id' | 'active'>) => void;
  purchaseReward: (id: string) => void;
  deleteReward: (id: string) => void;
  
  // Punishment Actions
  addPunishment: (punishment: Omit<Punishment, 'id' | 'active'>) => void;
  completePunishment: (id: string) => void;
  deletePunishment: (id: string) => void;
  
  // Timer Actions
  startTimer: (taskId: string, taskTitle: string, targetMin: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: (completed: boolean, notes?: string) => void;
  resetTimer: () => void;
  tickTimer: () => void;
  
  // Goal Actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'completed'>) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  
  // Checklist Actions
  addChecklistItem: (item: Omit<ChecklistItem, 'id' | 'createdAt' | 'completed'>) => void;
  toggleChecklistItem: (id: string) => void;
  deleteChecklistItem: (id: string) => void;
  updateChecklistItem: (id: string, updates: Partial<ChecklistItem>) => void;
  
  // Other Actions
  checkLevelUp: () => void;
  updateDailyScore: (date: string) => void;
  initializeWeeklyBoss: () => void;
}

const initialPlayer: PlayerStats = {
  level: 1,
  totalXp: 0,
  nextLevelXp: 100,
  lifetimePositivePoints: 0,
  lifetimeNegativePoints: 0,
  currentPositiveBalance: 0,
  currentNegativeBalance: 0,
  activeStreaks: {},
  timezone: 'Asia/Tehran',
};

const defaultTasks: Task[] = [
  {
    id: 'task-001',
    title: '2 ساعت یادگیری',
    type: 'daily',
    domain: 'learning',
    targetDurationMin: 120,
    rewardPositive: 10,
    penaltyNegative: -15,
    xp: 50,
    difficulty: 'Normal',
    streakKey: 'daily:learning',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-002',
    title: '6 ساعت کار مفید',
    type: 'daily',
    domain: 'work',
    targetDurationMin: 360,
    rewardPositive: 20,
    penaltyNegative: -25,
    xp: 120,
    difficulty: 'Hard',
    streakKey: 'daily:work',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-003',
    title: '30 دقیقه ورزش',
    type: 'daily',
    domain: 'health',
    targetDurationMin: 30,
    rewardPositive: 5,
    penaltyNegative: -10,
    xp: 25,
    difficulty: 'Easy',
    streakKey: 'daily:workout',
    active: true,
    createdAt: new Date().toISOString(),
  },
];

const defaultRewards: Reward[] = [
  {
    id: 'reward-001',
    title: '1 ساعت سریال',
    costPositivePoints: 100,
    icon: '🎬',
    category: 'entertainment',
    active: true,
  },
  {
    id: 'reward-002',
    title: 'سفارش پیتزا',
    costPositivePoints: 150,
    icon: '🍕',
    category: 'food',
    active: true,
  },
  {
    id: 'reward-003',
    title: 'یک قهوه خوشمزه',
    costPositivePoints: 30,
    icon: '☕',
    category: 'treat',
    active: true,
  },
];

const defaultPunishments: Punishment[] = [
  {
    id: 'punishment-001',
    title: '10 شنا',
    clearsNegativePoints: 10,
    xpBonus: 20,
    difficulty: 'Hard',
    icon: '🏊',
    category: 'physical',
    active: true,
  },
  {
    id: 'punishment-002',
    title: '30 دقیقه مدیتیشن',
    clearsNegativePoints: 5,
    xpBonus: 10,
    difficulty: 'Easy',
    icon: '🧘',
    category: 'mental',
    active: true,
  },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: initialPlayer,
      tasks: defaultTasks,
      rewards: defaultRewards,
      punishments: defaultPunishments,
      sessions: [],
      dailyScores: [],
      weeklyBoss: null,
      goals: [],
      checklistItems: [],
      timer: {
        isRunning: false,
        isPaused: false,
        taskId: null,
        taskTitle: '',
        startTime: null,
        elapsedSeconds: 0,
        targetSeconds: 0,
      },

      // Task Actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
          active: true,
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      // Reward Actions
      addReward: (rewardData) => {
        const newReward: Reward = {
          ...rewardData,
          id: `reward-${Date.now()}`,
          active: true,
        };
        set((state) => ({ rewards: [...state.rewards, newReward] }));
      },

      purchaseReward: (id) => {
        const reward = get().rewards.find((r) => r.id === id);
        if (!reward) return;

        const { player } = get();
        if (player.currentPositiveBalance >= reward.costPositivePoints) {
          set((state) => ({
            player: {
              ...state.player,
              currentPositiveBalance:
                state.player.currentPositiveBalance - reward.costPositivePoints,
            },
          }));
          alert(`🎉 پاداش "${reward.title}" خریداری شد!`);
        } else {
          alert('❌ امتیاز مثبت کافی نیست!');
        }
      },

      deleteReward: (id) => {
        set((state) => ({
          rewards: state.rewards.filter((reward) => reward.id !== id),
        }));
      },

      // Punishment Actions
      addPunishment: (punishmentData) => {
        const newPunishment: Punishment = {
          ...punishmentData,
          id: `punishment-${Date.now()}`,
          active: true,
        };
        set((state) => ({ punishments: [...state.punishments, newPunishment] }));
      },

      completePunishment: (id) => {
        const punishment = get().punishments.find((p) => p.id === id);
        if (!punishment) return;

        set((state) => ({
          player: {
            ...state.player,
            currentNegativeBalance: Math.min(
              0,
              state.player.currentNegativeBalance + punishment.clearsNegativePoints
            ),
            totalXp: state.player.totalXp + punishment.xpBonus,
          },
        }));

        get().checkLevelUp();
        alert(`⚔️ تنبیه "${punishment.title}" انجام شد! +${punishment.xpBonus} XP`);
      },

      deletePunishment: (id) => {
        set((state) => ({
          punishments: state.punishments.filter((p) => p.id !== id),
        }));
      },

      // Timer Actions
      startTimer: (taskId, taskTitle, targetMin) => {
        set({
          timer: {
            isRunning: true,
            isPaused: false,
            taskId,
            taskTitle,
            startTime: new Date().toISOString(),
            elapsedSeconds: 0,
            targetSeconds: targetMin * 60,
          },
        });
      },

      pauseTimer: () => {
        set((state) => ({
          timer: { ...state.timer, isRunning: false, isPaused: true },
        }));
      },

      resumeTimer: () => {
        set((state) => ({
          timer: { ...state.timer, isRunning: true, isPaused: false },
        }));
      },

      stopTimer: (completed, notes) => {
        const { timer, tasks, player } = get();
        if (!timer.taskId) return;

        const task = tasks.find((t) => t.id === timer.taskId);
        
        // For free timer (no task)
        if (!task && timer.taskId === 'free-timer') {
          const durationMin = Math.floor(timer.elapsedSeconds / 60);
          const newSession: Session = {
            id: `session-${Date.now()}`,
            taskId: timer.taskId,
            taskTitle: timer.taskTitle,
            startTime: timer.startTime!,
            endTime: new Date().toISOString(),
            durationMin,
            completed,
            rewardClaimed: 0,
            penaltyApplied: 0,
            xpEarned: 0,
            notes,
          };

          set((state) => ({
            sessions: [...state.sessions, newSession],
            timer: {
              isRunning: false,
              isPaused: false,
              taskId: null,
              taskTitle: '',
              startTime: null,
              elapsedSeconds: 0,
              targetSeconds: 0,
            },
          }));

          alert(`⏱️ تایمر متوقف شد!\nمدت: ${durationMin} دقیقه`);
          return;
        }

        if (!task) return;

        const durationMin = Math.floor(timer.elapsedSeconds / 60);
        const ratio = Math.min(durationMin / task.targetDurationMin, 1);

        let earnedXP = 0;
        let earnedPositive = 0;
        let earnedNegative = 0;

        if (completed && ratio >= 0.8) {
          earnedXP = calculateXP(task, durationMin, player.activeStreaks[task.streakKey || ''] || 0);
          earnedPositive = task.rewardPositive;

          if (task.streakKey) {
            set((state) => ({
              player: {
                ...state.player,
                activeStreaks: {
                  ...state.player.activeStreaks,
                  [task.streakKey!]: (state.player.activeStreaks[task.streakKey!] || 0) + 1,
                },
              },
            }));
          }
        } else {
          earnedNegative = task.penaltyNegative;
        }

        const newSession: Session = {
          id: `session-${Date.now()}`,
          taskId: timer.taskId,
          taskTitle: timer.taskTitle,
          startTime: timer.startTime!,
          endTime: new Date().toISOString(),
          durationMin,
          completed,
          rewardClaimed: earnedPositive,
          penaltyApplied: earnedNegative,
          xpEarned: earnedXP,
          notes,
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
          player: {
            ...state.player,
            totalXp: state.player.totalXp + earnedXP,
            currentPositiveBalance: state.player.currentPositiveBalance + earnedPositive,
            currentNegativeBalance: state.player.currentNegativeBalance + earnedNegative,
            lifetimePositivePoints: state.player.lifetimePositivePoints + earnedPositive,
            lifetimeNegativePoints: state.player.lifetimeNegativePoints + Math.abs(earnedNegative),
          },
          timer: {
            isRunning: false,
            isPaused: false,
            taskId: null,
            taskTitle: '',
            startTime: null,
            elapsedSeconds: 0,
            targetSeconds: 0,
          },
        }));

        get().checkLevelUp();
        get().updateDailyScore(new Date().toISOString().split('T')[0]);

        if (completed) {
          alert(`🎉 تسک تکمیل شد!\n+${earnedXP} XP\n+${earnedPositive} امتیاز مثبت`);
        } else {
          alert(`❌ تسک ناتمام ماند!\n${earnedNegative} امتیاز منفی`);
        }
      },

      resetTimer: () => {
        set({
          timer: {
            isRunning: false,
            isPaused: false,
            taskId: null,
            taskTitle: '',
            startTime: null,
            elapsedSeconds: 0,
            targetSeconds: 0,
          },
        });
      },

      tickTimer: () => {
        set((state) => {
          if (state.timer.isRunning && !state.timer.isPaused) {
            return {
              timer: {
                ...state.timer,
                elapsedSeconds: state.timer.elapsedSeconds + 1,
              },
            };
          }
          return state;
        });
      },

      // Goal Actions
      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: `goal-${Date.now()}`,
          createdAt: new Date().toISOString(),
          completed: false,
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      toggleGoal: (id) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  completed: !goal.completed,
                  completedAt: !goal.completed ? new Date().toISOString() : undefined,
                }
              : goal
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      // Checklist Actions
      addChecklistItem: (itemData) => {
        const newItem: ChecklistItem = {
          ...itemData,
          id: `check-${Date.now()}`,
          createdAt: new Date().toISOString(),
          completed: false,
        };
        set((state) => ({ checklistItems: [...state.checklistItems, newItem] }));
      },

      toggleChecklistItem: (id) => {
        set((state) => ({
          checklistItems: state.checklistItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  completed: !item.completed,
                  completedAt: !item.completed ? new Date().toISOString() : undefined,
                }
              : item
          ),
        }));
      },

      deleteChecklistItem: (id) => {
        set((state) => ({
          checklistItems: state.checklistItems.filter((item) => item.id !== id),
        }));
      },

      updateChecklistItem: (id, updates) => {
        set((state) => ({
          checklistItems: state.checklistItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      // Other Actions
      checkLevelUp: () => {
        const { player } = get();
        const nextLevelXp = calculateNextLevelXP(player.level);

        if (player.totalXp >= nextLevelXp) {
          set((state) => ({
            player: {
              ...state.player,
              level: state.player.level + 1,
              nextLevelXp: calculateNextLevelXP(state.player.level + 1),
            },
          }));
          alert(`🎊 Level Up! شما به سطح ${player.level + 1} رسیدید!`);
        }
      },

      updateDailyScore: (date) => {
        const sessions = get().sessions.filter((s) => s.startTime.startsWith(date));
        
        const positivePoints = sessions.reduce((sum, s) => sum + s.rewardClaimed, 0);
        const negativePoints = sessions.reduce((sum, s) => sum + s.penaltyApplied, 0);
        const totalXpEarned = sessions.reduce((sum, s) => sum + s.xpEarned, 0);
        const tasksCompleted = sessions.filter((s) => s.completed).length;
        const tasksFailed = sessions.filter((s) => !s.completed).length;

        const existingIndex = get().dailyScores.findIndex((ds) => ds.date === date);
        
        const newScore: DailyScore = {
          date,
          positivePoints,
          negativePoints,
          netScore: positivePoints + negativePoints,
          totalXpEarned,
          tasksCompleted,
          tasksFailed,
          punishmentsDone: 0,
        };

        if (existingIndex >= 0) {
          set((state) => ({
            dailyScores: state.dailyScores.map((ds, i) =>
              i === existingIndex ? newScore : ds
            ),
          }));
        } else {
          set((state) => ({
            dailyScores: [...state.dailyScores, newScore],
          }));
        }
      },

      initializeWeeklyBoss: () => {
        const weekNum = getWeekNumber(new Date());
        const bossNames = [
          'اژدهای تعلل',
          'شیطان حواس‌پرتی',
          'غول تنبلی',
          'جن خستگی',
        ];

        set({
          weeklyBoss: {
            bossName: bossNames[weekNum % bossNames.length],
            week: `2025-W${weekNum}`,
            hp: 600,
            currentDamage: 0,
            requirements: [
              { task: '5 روز × 2h یادگیری', damage: 250, completed: false },
              { task: '5 روز × 6h کار', damage: 300, completed: false },
              { task: 'صفر کردن امتیازات منفی', damage: 50, completed: false },
            ],
            rewardOnDefeat: {
              xp: 300,
              positivePoints: 50,
              loot: 'Golden Pomodoro Token',
            },
            defeated: false,
          },
        });
      },
    }),
    {
      name: 'life-rpg-storage',
    }
  )
);

// Timer tick interval
if (typeof window !== 'undefined') {
  setInterval(() => {
    useGameStore.getState().tickTimer();
  }, 1000);
}