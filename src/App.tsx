import { useState, useEffect, useMemo } from 'react';
import { StudyDay, Category, WeeklyStatus } from './types';
import { getInitialSchedule, categoryStyles, motivationalQuotes } from './data';
import DashboardStats from './components/DashboardStats';
import DayDetailPanel from './components/DayDetailPanel';
import { 
  Calendar, 
  Search, 
  BookOpen, 
  Filter, 
  Grid, 
  Table as TableIcon, 
  List, 
  RotateCcw, 
  CheckCircle, 
  BookMarked,
  Sparkles,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  FolderSync
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_KEY = 'study_schedule_data_v2026';

export default function App() {
  // Page states
  const [schedule, setSchedule] = useState<StudyDay[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [viewMode, setViewMode] = useState<'card' | 'table' | 'timeline'>('card');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date('2026-05-27T05:54:28Z'));

  // Weekly expand/collapse state
  const [weeksStatus, setWeeksStatus] = useState<Record<number, boolean>>({
    6: true,
    7: true,
    8: true,
    9: true,
    10: true
  });

  // Load schedule data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as StudyDay[];
        setSchedule(parsed);
        
        // Auto select today or first item
        const todayItem = parsed.find(day => day.fullDate === '2026-05-27');
        if (todayItem) {
          setSelectedDayId(todayItem.id);
        } else if (parsed.length > 0) {
          setSelectedDayId(parsed[0].id);
        }
      } catch (e) {
        // Fallback on corrupt json
        const initial = getInitialSchedule();
        setSchedule(initial);
        setSelectedDayId(initial[0].id);
      }
    } else {
      const initial = getInitialSchedule();
      setSchedule(initial);
      setSelectedDayId(initial[0].id);
    }

    // Set a matching quote index
    setQuoteIndex(Math.floor(Math.random() * motivationalQuotes.length));
    
    // Virtual calendar clock updating
    const interval = setInterval(() => {
      setCurrentDateTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save changes to localstorage whenever state is modified
  const handleUpdateDay = (updatedDay: StudyDay) => {
    const nextSchedule = schedule.map(day => 
      day.id === updatedDay.id ? updatedDay : day
    );
    setSchedule(nextSchedule);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSchedule));
  };

  // Quick reset all ticks and notes
  const handleResetData = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu học tập ban đầu và xóa hết ghi chú?')) {
      const initial = getInitialSchedule();
      setSchedule(initial);
      setSelectedDayId(initial[0].id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  };

  // Helper to check standard categories
  const toggleWeek = (weekNum: number) => {
    setWeeksStatus(prev => ({
      ...prev,
      [weekNum]: !prev[weekNum]
    }));
  };

  // Expand or collapse all weeks
  const toggleAllWeeks = (expand: boolean) => {
    setWeeksStatus({
      6: expand,
      7: expand,
      8: expand,
      9: expand,
      10: expand
    });
  };

  // Select a random quote
  const rotateQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
  };

  // Active day item computed property
  const selectedDay = useMemo(() => {
    return schedule.find(day => day.id === selectedDayId);
  }, [schedule, selectedDayId]);

  // Compute category items mapping counts
  const categoryCounts = useMemo(() => {
    const counts: Record<Category | 'All', number> = {
      All: schedule.length,
      Life: 0,
      TOEIC: 0,
      Frontend: 0,
      Backend: 0,
      AWS: 0,
      'E-learning': 0,
      Project: 0,
      Review: 0
    };

    schedule.forEach(day => {
      day.categories.forEach(cat => {
        counts[cat]++;
      });
    });

    return counts;
  }, [schedule]);

  // Handle queries & categorisation filter in-one
  const filteredSchedule = useMemo(() => {
    return schedule.filter(day => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        day.dateString.includes(query) ||
        day.dayOfWeek.toLowerCase().includes(query) ||
        day.originalContent.toLowerCase().includes(query) ||
        (day.notes && day.notes.toLowerCase().includes(query)) ||
        `tuần ${day.week}`.includes(query);

      const matchesCategory = 
        selectedCategory === 'All' || 
        day.categories.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [schedule, searchQuery, selectedCategory]);

  // Group filtered results by Weeks for rendering
  const scheduleByWeeks = useMemo(() => {
    const groups: Record<number, StudyDay[]> = {
      6: [],
      7: [],
      8: [],
      9: [],
      10: []
    };

    filteredSchedule.forEach(day => {
      if (groups[day.week]) {
        groups[day.week].push(day);
      }
    });

    return groups;
  }, [filteredSchedule]);

  // Calculate overall tasks statistics to show dynamic welcome header
  const totalTasks = useMemo(() => {
    return schedule.reduce((acc, curr) => acc + curr.tasks.length, 0);
  }, [schedule]);

  const completedTasks = useMemo(() => {
    return schedule.reduce((acc, curr) => acc + curr.tasks.filter(t => t.completed).length, 0);
  }, [schedule]);

  const percentProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Render Category Tab Badge helper
  const renderCategoryTab = (cat: Category | 'All', label: string) => {
    const isActive = selectedCategory === cat;
    const count = categoryCounts[cat];
    
    return (
      <button
        key={cat}
        type="button"
        onClick={() => setSelectedCategory(cat)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
          isActive 
            ? 'bg-slate-900 text-white shadow-sm' 
            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/50'
        }`}
      >
        <span>{label}</span>
        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'}`}>
          {count}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/20 text-slate-800 flex flex-col selection:bg-indigo-100">
      
      {/* Dynamic Header & Welcome Area */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border-b border-indigo-950/20 py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Branding & Sub-title */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-indigo-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-xs uppercase tracking-widest font-bold font-mono">My Study Roadmap 2026</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-2">
                Lịch Học & Kế Hoạch Cá Nhân
              </h1>
              
              <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                Học TOEIC chuyên sâu (Listening, Reading, Shadowing), trang bị AWS Cloud Foundation (IAM, EC2, S3, RDS), và làm chủ lập trình Web Fullstack với React & Node ExpressJS.
              </p>
            </div>

            {/* Simulated Live status card */}
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 sm:items-center">
              
              {/* Virtual current date card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Thời gian hệ thống</div>
                  <div className="text-sm font-semibold font-mono">
                    Thứ 4, 27/5/2026 
                  </div>
                </div>
              </div>

              {/* Progress visual token */}
              <div className="bg-emerald-500/10 backdrop-blur-md rounded-xl p-3 border border-emerald-500/20 flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-300 font-mono uppercase tracking-wider">Tiến Độ Chung</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">
                    {percentProgress}% Hoàn Thành
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Motivational quote area */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-indigo-300">💡 Châm ngôn:</span>
              <span className="italic">"{motivationalQuotes[quoteIndex]}"</span>
            </div>
            <button 
              type="button"
              onClick={rotateQuote}
              className="text-xs text-indigo-300 hover:text-white transition-colors underline cursor-pointer self-start sm:self-auto"
            >
              Xem câu tiếp theo
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Statistics Panels Grid */}
        <DashboardStats days={schedule} />

        {/* Filters and Utilities Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 flex flex-col gap-4">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Search inputs */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm nội dung (ví dụ: S3, TOEIC, React, Tuần 7...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Views Mode Controls */}
            <div className="flex items-center self-end sm:self-auto gap-3">
              <span className="text-xs font-medium text-slate-400 md:inline hidden">Hiển thị:</span>
              <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/20">
                <button
                  type="button"
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all ${
                    viewMode === 'card' 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Xem dạng thẻ học tập"
                >
                  <Grid className="w-3.5 h-3.5" /> Thẻ
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all ${
                    viewMode === 'table' 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Xem dạng bảng truy vấn"
                >
                  <TableIcon className="w-3.5 h-3.5" /> Bảng
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('timeline')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all ${
                    viewMode === 'timeline' 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Xem dòng thời gian"
                >
                  <List className="w-3.5 h-3.5" /> Lộ trình
                </button>
              </div>

              {/* Reset layout tools */}
              <button
                type="button"
                onClick={handleResetData}
                className="p-2 sm:px-3 sm:py-2 text-slate-400 hover:text-rose-500 border border-slate-200.50 hover:bg-rose-50/50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs"
                title="Khôi phục trạng thái ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="sm:inline hidden">Đặt lại</span>
              </button>
            </div>

          </div>

          {/* Categories Horizontal Filters */}
          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
              <Filter className="w-3 h-3" />
              <span>Chủ đề / Khóa học:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {renderCategoryTab('All', '🎒 Tất cả')}
              {renderCategoryTab('TOEIC', '🔈 TOEIC')}
              {renderCategoryTab('AWS', 'AWS Cloud')}
              {renderCategoryTab('Frontend', 'ReactJS')}
              {renderCategoryTab('Backend', 'ExpressJS')}
              {renderCategoryTab('E-learning', 'Nộp Báo Cáo')}
              {renderCategoryTab('Project', 'Dự Án')}
              {renderCategoryTab('Review', 'Ôn Tập')}
              {renderCategoryTab('Life', 'Sinh Hoạt')}
            </div>
          </div>

        </div>

        {/* Info notifications for Today (Wednesday 27/5) */}
        {filteredSchedule.some(d => d.fullDate === '2026-05-27') && (
          <div id="today-banner-notif" className="bg-indigo-600/10 border border-indigo-200 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-indigo-600 text-white rounded-xl animate-bounce">
                🚀
              </span>
              <div>
                <h4 className="font-bold text-indigo-900 text-sm">Hôm nay là Ngày bắt đầu: Thứ 4 - 27/5 (Tuần 6)</h4>
                <p className="text-xs text-indigo-700">Mục tiêu hôm nay: "Lập kế hoạch học tập, ổn định sinh hoạt, setup góc học tập, ngủ đủ 8 tiếng".</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setSelectedDayId('week6-d1')}
              className="text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
            >
              Mở ngay mục tiêu Hôm nay
            </button>
          </div>
        )}

        {/* Left-Right Split Screen Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Schedule Views Container */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* Collapse Expand controllers for weeks list */}
            {viewMode === 'card' && (
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="text-slate-400 font-medium">Danh sách các tuần học</span>
                <div className="flex items-center gap-3 text-indigo-600 font-semibold">
                  <button type="button" onClick={() => toggleAllWeeks(true)} className="hover:underline cursor-pointer">Mở rộng tất cả</button>
                  <span className="text-slate-200">|</span>
                  <button type="button" onClick={() => toggleAllWeeks(false)} className="hover:underline cursor-pointer">Thu gọn tất cả</button>
                </div>
              </div>
            )}

            {/* Empty view state handler */}
            {filteredSchedule.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
                <span className="text-3xl block mb-2">🔍</span>
                <h3 className="text-base font-bold text-slate-700 mb-1">Không tìm thấy ngày học phù hợp</h3>
                <p className="text-xs text-slate-400">Hãy thử nhập từ khóa khác hoặc xóa bớt bộ lọc chủ đề.</p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-xs font-semibold cursor-pointer"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}

            {/* 1. VIEW_MODE === CARD VIEW */}
            {viewMode === 'card' && filteredSchedule.length > 0 && (
              <div className="space-y-4">
                {[6, 7, 8, 9, 10].map(weekNum => {
                  const weekDays = scheduleByWeeks[weekNum] || [];
                  if (weekDays.length === 0) return null;

                  const isExpanded = weeksStatus[weekNum];
                  
                  // Compute weeks success rate
                  const weekTotalTasks = weekDays.reduce((acc, curr) => acc + curr.tasks.length, 0);
                  const weekCompletedTasks = weekDays.reduce((acc, curr) => acc + curr.tasks.filter(t => t.completed).length, 0);
                  const weekPercent = weekTotalTasks > 0 ? Math.round((weekCompletedTasks / weekTotalTasks) * 100) : 0;

                  return (
                    <div 
                      key={weekNum} 
                      className="bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* Week Accordion header */}
                      <button
                        type="button"
                        onClick={() => toggleWeek(weekNum)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 hover:bg-slate-100/30 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="p-1.5 bg-slate-900 text-white rounded-lg font-mono text-xs font-bold leading-none">
                            T{weekNum}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">
                              CHƯƠNG TRÌNH TUẦN {weekNum}
                            </h3>
                            <p className="text-[11px] text-slate-400">
                              {weekDays.length} ngày trong danh sách
                            </p>
                          </div>
                        </div>

                        {/* Interactive progress rate slider */}
                        <div className="flex items-center gap-4">
                          <div className="sm:flex items-center gap-2 hidden">
                            <span className="text-[11px] font-semibold text-slate-500 font-mono">{weekPercent}% Hoàn Thành</span>
                            <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${weekPercent}%` }} />
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      {/* Accordion content list of days */}
                      {isExpanded && (
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white">
                          {weekDays.map(day => {
                            const isSelected = day.id === selectedDayId;
                            const completedTasks = day.tasks.filter(t => t.completed).length;
                            const totalTasks = day.tasks.length;
                            const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                            const isToday = day.fullDate === '2026-05-27';

                            return (
                              <div
                                key={day.id}
                                onClick={() => setSelectedDayId(day.id)}
                                className={`group p-4 rounded-xl border-2 text-left cursor-pointer transition-all duration-150 relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                                  isSelected 
                                    ? 'bg-indigo-50/10 border-indigo-600 shadow-md ring-2 ring-indigo-50' 
                                    : isToday
                                      ? 'bg-amber-50/10 border-amber-300 hover:border-amber-400 shadow-sm'
                                      : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                                }`}
                              >
                                {/* Active label tokens inside cards */}
                                {isToday && (
                                  <span className="absolute top-0 right-0 bg-amber-500 text-white font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-bl-lg">
                                    Hôm nay
                                  </span>
                                )}

                                <div>
                                  {/* Title row */}
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs font-bold text-slate-500">
                                        {day.dayOfWeek}
                                      </span>
                                      <span className="text-[11px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                                        {day.dateString}
                                      </span>
                                    </div>
                                    
                                    {/* Mini completion percent indicators */}
                                    {totalTasks > 0 && (
                                      <span className={`text-[10px] font-mono px-1 rounded-md ${pct === 100 ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-400'}`}>
                                        {completedTasks}/{totalTasks}
                                      </span>
                                    )}
                                  </div>

                                  {/* Description summary truncated */}
                                  <p className="text-xs text-slate-700 font-semibold line-clamp-3 mb-3 leading-relaxed group-hover:text-slate-900 transition-colors">
                                    {day.originalContent}
                                  </p>
                                </div>

                                {/* Categories pill in cards bottom block */}
                                <div className="mt-3 pt-3 border-t border-slate-50/80 flex flex-wrap gap-1 items-center justify-between">
                                  <div className="flex flex-wrap gap-1">
                                    {day.categories.slice(0, 2).map(cat => {
                                      const style = categoryStyles[cat];
                                      return (
                                        <span 
                                          key={cat} 
                                          className={`text-[9px] px-1.5 py-0.2 rounded font-medium border ${style.bg} ${style.text} ${style.border}`}
                                        >
                                          {cat}
                                        </span>
                                      );
                                    })}
                                    {day.categories.length > 2 && (
                                      <span className="text-[8px] text-slate-400">+{day.categories.length - 2}</span>
                                    )}
                                  </div>

                                  {/* Checklist progress tracker */}
                                  <div className="w-12 bg-slate-100 h-1 rounded-full overflow-hidden">
                                    <div className="h-1 bg-indigo-500" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. VIEW_MODE === TABLE VIEW */}
            {viewMode === 'table' && filteredSchedule.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-20">Tuần</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-32">Ngày</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nội Dung Chương Trình Học</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-28 text-center">Tiến độ</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-24 text-center">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSchedule.map(day => {
                        const isSelected = day.id === selectedDayId;
                        const completedTasks = day.tasks.filter(t => t.completed).length;
                        const totalTasks = day.tasks.length;
                        const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                        const isToday = day.fullDate === '2026-05-27';

                        return (
                          <tr 
                            key={day.id}
                            onClick={() => setSelectedDayId(day.id)}
                            className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-indigo-50/30' 
                                : isToday 
                                  ? 'bg-amber-50/20' 
                                  : ''
                            }`}
                          >
                            {/* Week number columns */}
                            <td className="p-4 font-mono text-xs font-bold text-slate-600 align-top">
                              Tuần {day.week}
                            </td>

                            {/* Date Badge columns */}
                            <td className="p-4 align-top">
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-xs text-slate-800">{day.dayOfWeek}</span>
                                <span className="text-[11px] text-slate-400 font-mono inline-flex items-center gap-1">
                                  {day.dateString}
                                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title="Hôm nay" />}
                                </span>
                              </div>
                            </td>

                            {/* Original Content text with topics highlighted */}
                            <td className="p-4 align-top">
                              <div className="space-y-2">
                                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                                  {day.originalContent}
                                </p>
                                
                                {/* Pill Badges */}
                                <div className="flex flex-wrap gap-1 pr-4">
                                  {day.categories.map(cat => {
                                    const style = categoryStyles[cat];
                                    return (
                                      <span 
                                        key={cat} 
                                        className={`text-[9px] px-1.5 py-0.2 rounded font-medium border ${style.bg} ${style.text} ${style.border}`}
                                      >
                                        {cat}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>

                            {/* Progress column with numerical percent */}
                            <td className="p-4 text-center align-top">
                              <div className="flex flex-col items-center justify-center gap-1 mt-1">
                                <span className={`text-xs font-mono font-semibold ${pct === 100 ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                                  {pct}%
                                </span>
                                <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                                  <div className="h-1 bg-indigo-600 transition-all duration-300" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {completedTasks}/{totalTasks} tasks
                                </span>
                              </div>
                            </td>

                            {/* Actions Inspect link buttons */}
                            <td className="p-4 text-center align-top">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setSelectedDayId(day.id); }}
                                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium ${
                                  isSelected 
                                    ? 'bg-slate-900 border-slate-950 text-white shadow-sm' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                Xem
                              </button>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. VIEW_MODE === TIMELINE ROADMAP VIEW */}
            {viewMode === 'timeline' && filteredSchedule.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-6 shadow-sm relative">
                
                {/* Central progress line */}
                <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-100" />

                <div className="space-y-6">
                  {filteredSchedule.map((day, index) => {
                    const isSelected = day.id === selectedDayId;
                    const completedTasks = day.tasks.filter(t => t.completed).length;
                    const totalTasks = day.tasks.length;
                    const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                    const isToday = day.fullDate === '2026-05-27';

                    return (
                      <div 
                        key={day.id}
                        onClick={() => setSelectedDayId(day.id)}
                        className="flex gap-4 relative cursor-pointer group"
                      >
                        {/* Timeline Node marker dot */}
                        <div className="z-10 shrink-0 mt-1">
                          <div 
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              pct === 100 
                                ? 'bg-emerald-500 border-emerald-500' 
                                : isSelected 
                                  ? 'bg-indigo-600 border-indigo-600 ring-4 ring-indigo-50' 
                                  : 'bg-white border-slate-300 group-hover:border-indigo-500'
                            }`}
                          >
                            {pct === 100 && <span className="text-[8px] text-white">✓</span>}
                          </div>
                        </div>

                        {/* Interactive panel list item description */}
                        <div 
                          className={`flex-1 p-4 rounded-xl border transition-all duration-150 ${
                            isSelected 
                              ? 'bg-slate-50/50 border-indigo-500 shadow-sm' 
                              : isToday
                                ? 'bg-amber-50/10 border-amber-300 shadow-xs'
                                : 'bg-white border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.2 rounded">
                                Tuần {day.week}
                              </span>
                              <span className="font-semibold text-xs text-slate-800">
                                {day.dayOfWeek} ({day.dateString})
                              </span>
                              {isToday && (
                                <span className="text-[9px] font-mono font-bold bg-amber-500 text-white px-1.5 rounded-full">
                                  Hôm nay
                                </span>
                              )}
                            </div>
                            
                            <div className="text-[10px] text-slate-400 font-mono">
                              Ngày thứ {index + 1}
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 font-semibold leading-relaxed mb-3">
                            {day.originalContent}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-3 border-t border-slate-50">
                            
                            {/* Categories tags */}
                            <div className="flex flex-wrap gap-1">
                              {day.categories.map(cat => {
                                const style = categoryStyles[cat];
                                return (
                                  <span 
                                    key={cat} 
                                    className={`text-[9px] px-1.5 py-0.2 rounded font-medium border ${style.bg} ${style.text} ${style.border}`}
                                  >
                                    {cat}
                                  </span>
                                );
                              })}
                            </div>

                            {/* Completion percent */}
                            <div className="flex items-center gap-2 font-mono">
                              <span>Tiến độ:</span>
                              <span className={pct === 100 ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                                {pct}%
                              </span>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>

          {/* Right Side: STICKY DAY DETAILS WORKSPACE */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
            {selectedDay ? (
              <DayDetailPanel 
                day={selectedDay} 
                onUpdateDay={handleUpdateDay} 
              />
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 shadow-sm sticky top-6">
                📚 Hãy chọn bất kỳ ngày học nào bên danh sách để xem chi tiết, tích hoàn thành công việc và ghi chép nhật ký học tập.
              </div>
            )}
          </div>

        </div>

        {/* Footer info & resources dashboard instructions */}
        <footer className="mt-16 pt-8 border-t border-slate-200 text-center max-w-4xl mx-auto pb-12">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium mb-3">
            <span className="flex items-center gap-1">🔈 TOEIC Prep (Part 1-7)</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">☁️ AWS Solutions Architect Foundation</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">⚛️ React, Vite, TS and Tailwind CSS</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">🟢 Node Express, S3, RDS REST API</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-lg mx-auto">
            Giao diện được tinh chỉnh responsive đẹp mắt, hỗ trợ lưu trữ cục bộ tự động 100%. Hãy bắt đầu tích lũy kiến thức ngay hôm nay để gặt hái thành công!
          </p>
        </footer>

      </main>
    </div>
  );
}
