import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Square, 
  CheckCircle2, 
  Bell, 
  BellOff,
  AlertCircle,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { getCurrentJalaaliDate, formatJalaaliDateTime, parseJalaaliToISO } from '../utils/jalaali';

export default function Checklist() {
  const { checklistItems, addChecklistItem, toggleChecklistItem, deleteChecklistItem, updateChecklistItem } = useGameStore();
  const [showForm, setShowForm] = useState(false);
  const [filterView, setFilterView] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: getCurrentJalaaliDate(),
    dueTime: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    reminder: false,
    reminderTime: '',
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  // Check for reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      checklistItems.forEach((item) => {
        if (item.reminder && item.reminderTime && !item.completed) {
          const reminderDate = new Date(item.reminderTime);
          const diff = reminderDate.getTime() - now.getTime();
          
          // Notify 1 minute before
          if (diff > 0 && diff <= 60000) {
            if (Notification.permission === 'granted') {
              new Notification('🔔 یادآور Life RPG', {
                body: item.title,
                icon: '/icon.png',
              });
            } else {
              alert(`🔔 یادآور: ${item.title}`);
            }
          }
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [checklistItems]);

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let reminderTime = undefined;
    if (formData.reminder && formData.dueDate && formData.dueTime) {
      try {
        const dateISO = parseJalaaliToISO(formData.dueDate);
        const [hours, minutes] = formData.dueTime.split(':');
        const reminderDate = new Date(dateISO);
        reminderDate.setHours(parseInt(hours), parseInt(minutes), 0);
        reminderTime = reminderDate.toISOString();
      } catch (e) {
        alert('فرمت تاریخ یا ساعت نادرست است!');
        return;
      }
    }

    addChecklistItem({
      ...formData,
      reminderTime,
    });

    setFormData({
      title: '',
      description: '',
      dueDate: getCurrentJalaaliDate(),
      dueTime: '',
      priority: 'medium',
      reminder: false,
      reminderTime: '',
      tags: [],
    });
    setTagInput('');
    setShowForm(false);

    if (formData.reminder) {
      requestNotificationPermission();
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const today = getCurrentJalaaliDate();
  const filteredItems = checklistItems.filter((item) => {
    if (filterView === 'completed') return item.completed;
    if (filterView === 'today') return item.dueDate === today && !item.completed;
    if (filterView === 'upcoming') return (item.dueDate || '') > today && !item.completed;
    return true;
  });

  const activeItems = filteredItems.filter((i) => !i.completed);
  const completedItems = filteredItems.filter((i) => i.completed);

  const getPriorityColor = (priority: string) => {
    return priority === 'high' ? 'text-red-400' : priority === 'medium' ? 'text-yellow-400' : 'text-green-400';
  };

  const getPriorityIcon = (priority: string) => {
    return priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckSquare className="w-7 h-7 text-primary" />
              چک‌لیست کارها
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              امروز: {today}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-all flex items-center gap-2 font-bold"
          >
            <Plus className="w-5 h-5" />
            کار جدید
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'today', 'upcoming', 'completed'].map((view) => (
            <button
              key={view}
              onClick={() => setFilterView(view as any)}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                filterView === view
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {view === 'all' && '🌟 همه'}
              {view === 'today' && '📅 امروز'}
              {view === 'upcoming' && '⏭️ آینده'}
              {view === 'completed' && '✅ تکمیل شده'}
            </button>
          ))}
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-primary/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-lg mb-4">کار جدید</h3>

            <div>
              <label className="block text-sm text-gray-400 mb-2">عنوان *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="مثال: تماس با مشتری، خرید مواد غذایی"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">توضیحات</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="جزئیات..."
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  <CalendarIcon className="w-4 h-4 inline ml-1" />
                  تاریخ (شمسی)
                </label>
                <input
                  type="text"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  placeholder="1404/07/20"
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  <Clock className="w-4 h-4 inline ml-1" />
                  ساعت
                </label>
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">اولویت</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
                >
                  <option value="low">🟢 کم</option>
                  <option value="medium">🟡 متوسط</option>
                  <option value="high">🔴 زیاد</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">برچسب‌ها</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="فشار Enter برای افزودن"
                  className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Reminder */}
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reminder}
                  onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="flex items-center gap-2 font-bold">
                  {formData.reminder ? <Bell className="w-5 h-5 text-primary" /> : <BellOff className="w-5 h-5 text-gray-500" />}
                  فعال‌سازی یادآور
                </span>
              </label>
              {formData.reminder && (
                <p className="text-xs text-gray-400 mt-2">
                  <AlertCircle className="w-4 h-4 inline ml-1" />
                  یادآور در زمان مشخص شده نمایش داده می‌شود
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-all"
              >
                ذخیره
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
              >
                لغو
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Items */}
      {activeItems.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <h3 className="font-bold text-lg mb-4 text-gray-300">
            📋 کارهای فعال ({activeItems.length})
          </h3>
          <div className="space-y-3">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className={`bg-gray-900/70 border rounded-lg p-4 hover:border-primary/50 transition-all ${
                  item.priority === 'high' ? 'border-red-500/30' : 
                  item.priority === 'medium' ? 'border-yellow-500/30' : 'border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className="mt-1 hover:scale-110 transition-transform"
                    >
                      <Square className="w-6 h-6 text-gray-400 hover:text-positive" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{getPriorityIcon(item.priority)}</span>
                        <h4 className="font-bold text-lg">{item.title}</h4>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        {item.dueDate && (
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {item.dueDate}
                            {item.dueTime && ` - ${item.dueTime}`}
                          </span>
                        )}
                        {item.reminder && (
                          <span className="flex items-center gap-1 text-primary">
                            <Bell className="w-3 h-3" />
                            یادآور فعال
                          </span>
                        )}
                        {item.tags.map((tag) => (
                          <span key={tag} className="bg-primary/20 text-primary px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('مطمئنی می‌خوای این کار رو حذف کنی?')) {
                        deleteChecklistItem(item.id);
                      }
                    }}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-negative" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Items */}
      {completedItems.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-positive/30">
          <h3 className="font-bold text-lg mb-4 text-positive flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            تکمیل شده ({completedItems.length})
          </h3>
          <div className="space-y-2">
            {completedItems.map((item) => (
              <div
                key={item.id}
                className="bg-positive/10 border border-positive/30 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <CheckCircle2 className="w-5 h-5 text-positive flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-bold text-positive line-through">
                      {item.title}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      {item.completedAt && `تکمیل: ${formatJalaaliDateTime(item.completedAt)}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteChecklistItem(item.id)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
          <CheckSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            هنوز کاری نداری! یکی اضافه کن ✍️
          </p>
        </div>
      )}
    </div>
  );
}