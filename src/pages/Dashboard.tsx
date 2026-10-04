import React from 'react';
import { Student, EmulationLog, GroupInfo } from '../types';
import { Trophy, Award, AlertTriangle, Users, TrendingUp, Zap, Star, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/sound';

interface DashboardProps {
  students: Student[];
  logs: EmulationLog[];
  currentWeek: number;
  onNavigateTab: (tab: any) => void;
  onSelectStudent: (student: Student) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  logs,
  currentWeek,
  onNavigateTab,
  onSelectStudent
}) => {
  // Calculate stats
  const totalClassScore = students.reduce((sum, s) => sum + s.score, 0);
  const avgClassScore = students.length > 0 ? Math.round(totalClassScore / students.length) : 0;

  // Calculate Group scores
  const groupScores: { [key: number]: { total: number; count: number } } = { 1: { total: 0, count: 0 }, 2: { total: 0, count: 0 }, 3: { total: 0, count: 0 }, 4: { total: 0, count: 0 } };
  students.forEach(s => {
    if (groupScores[s.group]) {
      groupScores[s.group].total += s.score;
      groupScores[s.group].count += 1;
    }
  });

  const groups: GroupInfo[] = [1, 2, 3, 4].map(gId => {
    const data = groupScores[gId];
    const avg = data.count > 0 ? Math.round(data.total / data.count) : 0;
    return {
      id: gId,
      name: `Tổ ${gId}`,
      score: data.total,
      memberCount: data.count,
      avgScore: avg
    };
  });

  // Sort groups by score descending
  const sortedGroups = [...groups].sort((a, b) => b.avgScore - a.avgScore);
  const leadingGroup = sortedGroups[0] || groups[0];

  // Top Student
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);
  const topStudent = sortedStudents[0];
  const mostViolatedStudent = [...students].sort((a, b) => a.score - b.score)[0];

  // Violation breakdown stats from logs
  const violationLogs = logs.filter(l => l.type === 'penalty');
  const violationCounts: { [key: string]: number } = {};
  violationLogs.forEach(l => {
    violationCounts[l.criteriaName] = (violationCounts[l.criteriaName] || 0) + 1;
  });
  const topViolations = Object.entries(violationCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner with Gamification Vibe */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 backdrop-blur-sm skew-x-12 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-white/25">
            <SparklesIcon className="w-4 h-4 text-yellow-300" />
            HỆ THỐNG THI ĐUA TUẦN {currentWeek} · LỚP 10A1 - THPT XUÂN GIANG
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Chào mừng ngày mới năng động và kỷ luật!
          </h2>
          <p className="text-red-100 text-xs md:text-sm font-medium leading-relaxed mb-6">
            Bảng xếp hạng thi đua cập nhật thời gian thực. Tổ {leadingGroup.name} đang tạm dẫn đầu toàn lớp. Hãy tiếp tục phát huy tinh thần đoàn kết và nề nếp tốt!
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('scoring');
              }}
              className="px-6 py-3 bg-white text-red-600 font-extrabold rounded-xl shadow-lg hover:bg-red-50 transition-all flex items-center gap-2 text-sm"
            >
              <Zap className="w-4 h-4 text-red-600 fill-red-600" />
              CHẤM ĐIỂM NHANH NGAY
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('leaderboard');
              }}
              className="px-6 py-3 bg-red-900/40 hover:bg-red-900/60 text-white font-bold rounded-xl border border-white/25 transition-all flex items-center gap-2 text-sm backdrop-blur-md"
            >
              <Trophy className="w-4 h-4 text-yellow-300" />
              Xem Bảng Xếp Hạng
            </button>
          </div>
        </div>
      </div>

      {/* Core Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Class Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Điểm TB Lớp</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{avgClassScore} <span className="text-xs font-medium text-slate-500">điểm/HS</span></div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2% so với tuần trước
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Leading Group */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tổ Dẫn Đầu</div>
            <div className="text-2xl font-extrabold text-amber-600 flex items-center gap-1.5">
              👑 {leadingGroup.name}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Điểm TB: <strong className="text-slate-800">{leadingGroup.avgScore}</strong>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Top Star Student */}
        <div 
          onClick={() => topStudent && onSelectStudent(topStudent)}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-yellow-400 transition-all group"
        >
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ngôi sao sáng</div>
            <div className="text-lg font-bold text-slate-900 truncate max-w-[150px] group-hover:text-red-600 transition-colors">
              {topStudent ? topStudent.name : 'Chưa có'}
            </div>
            <div className="text-[11px] text-yellow-600 font-bold mt-1 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" /> {topStudent?.score} điểm
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-xl shrink-0">
            {topStudent?.avatar || '⭐'}
          </div>
        </div>

        {/* Card 4: Most Violated */}
        <div 
          onClick={() => mostViolatedStudent && onSelectStudent(mostViolatedStudent)}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-red-300 transition-all group"
        >
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cần nhắc nhở</div>
            <div className="text-lg font-bold text-slate-900 truncate max-w-[150px] group-hover:text-red-600 transition-colors">
              {mostViolatedStudent ? mostViolatedStudent.name : 'Không có'}
            </div>
            <div className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> {mostViolatedStudent?.score} điểm
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Groups Score Comparison & Violation Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Group Bar Chart Comparison */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">So sánh Điểm số các Tổ</h3>
              <p className="text-xs text-slate-500">Điểm trung bình cộng thành viên trong tổ</p>
            </div>
            <button 
              onClick={() => {
                sound.playClick();
                onNavigateTab('groups');
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Xem chi tiết tổ <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 my-auto">
            {groups.map((g) => {
              const maxScore = Math.max(...groups.map(item => item.avgScore), 100);
              const percent = Math.min(Math.round((g.avgScore / maxScore) * 100), 100);
              const isFirst = g.id === leadingGroup.id;
              return (
                <div key={g.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-2">
                      {isFirst && <span className="text-amber-500">👑</span>}
                      {g.name} <span className="text-[11px] font-normal text-slate-500">({g.memberCount} thành viên)</span>
                    </span>
                    <span className="tabular-nums font-extrabold text-slate-900">{g.avgScore} điểm TB</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isFirst 
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                          : g.id === 2 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-500'
                          : g.id === 3
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                          : 'bg-gradient-to-r from-rose-600 to-red-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Cập nhật liên tục theo thời gian thực từ Google Sheets</span>
            <span className="font-semibold text-slate-700">Tổng số học sinh: {students.length}</span>
          </div>
        </div>

        {/* Violation Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Lỗi vi phạm phổ biến</h3>
              <span className="text-xs bg-red-50 text-red-700 font-semibold px-2.5 py-0.5 rounded-md">Tuần {currentWeek}</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Thống kê các lỗi vi phạm thường gặp để giáo viên chấn chỉnh.</p>

            <div className="space-y-3.5">
              {topViolations.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">Chưa có ghi nhận vi phạm nào trong tuần này! 🎉</div>
              ) : (
                topViolations.map(([name, count], idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">{name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-red-600 bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shrink-0">
                      {count} lần
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('logs');
            }}
            className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
          >
            Xem toàn bộ Lịch sử & Nhật ký
          </button>
        </div>
      </div>
    </div>
  );
};

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
