import React, { useState } from 'react';
import { StudyDay, SubTask, Category } from '../types';
import { categoryStyles } from '../data';
import { Plus, Trash2, CheckSquare, Square, Save, FileText, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';

interface DayDetailPanelProps {
  day: StudyDay;
  onUpdateDay: (updatedDay: StudyDay) => void;
}

export default function DayDetailPanel({ day, onUpdateDay }: DayDetailPanelProps) {
  const [newTaskText, setNewTaskText] = useState('');
  const [editingNotes, setEditingNotes] = useState(day.notes);

  // Sync state if day changes
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditingNotes(val);
    onUpdateDay({
      ...day,
      notes: val
    });
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = day.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateDay({
      ...day,
      tasks: updatedTasks
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: SubTask = {
      id: `${day.id}-task-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false
    };

    onUpdateDay({
      ...day,
      tasks: [...day.tasks, newTask]
    });
    setNewTaskText('');
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = day.tasks.filter(t => t.id !== taskId);
    onUpdateDay({
      ...day,
      tasks: updatedTasks
    });
  };

  // Pre-configured category headers
  const totalTasks = day.tasks.length;
  const completedTasks = day.tasks.filter(t => t.completed).length;
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 rounded-2xl shadow-sm p-6 sticky top-6">
      {/* Header Info */}
      <div className="border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">
            Tuần {day.week}
          </span>
          <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
            {day.dayOfWeek}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {day.fullDate}
          </span>
        </div>
        <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">
          Chi Tiết Học Tập Ngày {day.dateString}
        </h2>
      </div>

      {/* Categories Badge Display */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Chủ đề chính</h4>
        <div className="flex flex-wrap gap-2">
          {day.categories.map(cat => {
            const style = categoryStyles[cat];
            return (
              <span 
                key={cat} 
                className={`text-xs px-2.5 py-1 font-medium rounded-full border ${style.bg} ${style.text} ${style.border}`}
              >
                {style.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Progress meter */}
      <div className="mb-5 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
          <span>Tiến trình hoàn thành ngày</span>
          <span className="font-mono font-bold text-slate-700">{completedTasks}/{totalTasks} ({percent}%)</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Task Checklist list */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Nhiệm vụ cụ thể</h4>
        
        {day.tasks.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-slate-200 rounded-xl mb-3 text-slate-400 text-sm">
            Chưa có nhiệm vụ nào cho ngày này. Hãy khởi tạo nhiệm vụ mới!
          </div>
        ) : (
          <div className="space-y-2 mb-3 max-h-56 overflow-y-auto pr-1">
            {day.tasks.map(task => (
              <div 
                key={task.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-sm transition-all duration-150 ${
                  task.completed 
                    ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' 
                    : 'bg-white border-slate-100 text-slate-700 shadow-sm hover:border-indigo-100'
                }`}
              >
                <button 
                  type="button"
                  onClick={() => handleToggleTask(task.id)}
                  className="flex items-start gap-2.5 flex-1 text-left cursor-pointer"
                >
                  <span className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </span>
                  <span>{task.text}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors"
                  title="Xóa nhiệm vụ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Task input */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input 
            type="text"
            placeholder="Thêm nhiệm vụ mới..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-1 text-sm border border-slate-200 bg-white/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
          />
          <button 
            type="submit"
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer flex items-center justify-center transition-colors"
            title="Thêm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Study Notes Container */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Ghi chú và Nhật ký gỡ lỗi
          </h4>
          <span className="text-[10px] bg-slate-100 text-slate-400 font-mono px-1.5 py-0.5 rounded">Auto Safe</span>
        </div>
        <textarea 
          value={day.notes}
          onChange={handleNotesChange}
          placeholder="Viết ghi chú học học tập, từ vựng TOEIC mới phát hiện, sơ đồ vẽ nháp hay nhật ký debug lỗi..."
          rows={6}
          className="w-full text-sm border border-slate-200 rounded-xl p-3 bg-slate-50/50 shadow-inner focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none font-sans"
        />
        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
          <AlertCircle className="w-3 h-3" />
          <span>Thông tin được lưu tự động cục bộ vào thiết bị này.</span>
        </div>
      </div>
    </div>
  );
}
