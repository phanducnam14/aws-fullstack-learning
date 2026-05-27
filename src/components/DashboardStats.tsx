import { useMemo } from 'react';
import { StudyDay, Category } from '../types';
import { categoryStyles } from '../data';
import { Award, BookOpen, Calendar, Circle, CheckCircle2 } from 'lucide-react';

interface StatsProps {
  days: StudyDay[];
}

export default function DashboardStats({ days }: StatsProps) {
  const stats = useMemo(() => {
    const totalDays = days.length;
    let completedTasksCount = 0;
    let totalTasksCount = 0;
    let completedDaysCount = 0;

    const categoryStats: Record<Category, { total: number; completed: number }> = {
      Life: { total: 0, completed: 0 },
      TOEIC: { total: 0, completed: 0 },
      Frontend: { total: 0, completed: 0 },
      Backend: { total: 0, completed: 0 },
      AWS: { total: 0, completed: 0 },
      'E-learning': { total: 0, completed: 0 },
      Project: { total: 0, completed: 0 },
      Review: { total: 0, completed: 0 },
    };

    days.forEach(day => {
      let dayCompleted = true;
      if (day.tasks.length === 0) dayCompleted = false;

      day.tasks.forEach(t => {
        totalTasksCount++;
        if (t.completed) {
          completedTasksCount++;
        } else {
          dayCompleted = false;
        }
      });

      if (dayCompleted && day.tasks.length > 0) {
        completedDaysCount++;
      }

      day.categories.forEach(cat => {
        categoryStats[cat].total += day.tasks.length;
        categoryStats[cat].completed += day.tasks.filter(t => t.completed).length;
      });
    });

    const overallProgress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
    const completedDaysProgress = totalDays > 0 ? Math.round((completedDaysCount / totalDays) * 100) : 0;

    return {
      totalDays,
      completedDaysCount,
      completedDaysProgress,
      totalTasksCount,
      completedTasksCount,
      overallProgress,
      categoryStats
    };
  }, [days]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Target Overall Progress */}
      <div id="stat-card-progress" className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Tiến Độ Tổng Quan</span>
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold font-mono">
            {stats.overallProgress}%
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-baseline gap-2">
            <span>{stats.completedTasksCount}</span>
            <span className="text-xs text-slate-400 font-normal">/ {stats.totalTasksCount} mục tiêu</span>
          </h3>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${stats.overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Completed Days Streak & Badge */}
      <div id="stat-card-days" className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Ngày Hoàn Thành (100%)</span>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-baseline gap-2">
            <span>{stats.completedDaysCount}</span>
            <span className="text-xs text-slate-400 font-normal">/ {stats.totalDays} ngày học</span>
          </h3>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${stats.completedDaysProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* TOEIC Learning Progress */}
      <div id="stat-card-toeic" className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Mục Tiêu TOEIC</span>
          <span className="px-2 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 rounded">
            Tiếng Anh
          </span>
        </div>
        <div>
          {(() => {
            const total = stats.categoryStats['TOEIC'].total;
            const completed = stats.categoryStats['TOEIC'].completed;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <>
                <h3 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-baseline gap-2">
                  <span>{completed}</span>
                  <span className="text-xs text-slate-400 font-normal">/ {total} task đã hoàn thành</span>
                </h3>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Cloud & Engineering Progress */}
      <div id="stat-card-aws" className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">AWS & Chuyên Ngành</span>
          <span className="px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-600 rounded">
            Cloud
          </span>
        </div>
        <div>
          {(() => {
            const total = stats.categoryStats['AWS'].total + stats.categoryStats['Frontend'].total + stats.categoryStats['Backend'].total;
            const completed = stats.categoryStats['AWS'].completed + stats.categoryStats['Frontend'].completed + stats.categoryStats['Backend'].completed;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <>
                <h3 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-baseline gap-2">
                  <span>{completed}</span>
                  <span className="text-xs text-slate-400 font-normal">/ {total} task chuyên ngành</span>
                </h3>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
