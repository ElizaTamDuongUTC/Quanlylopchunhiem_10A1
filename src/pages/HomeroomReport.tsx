import React from 'react';
import { Student, EmulationLog } from '../types';
import { BarChart3, Trophy, AlertTriangle, Users, CheckCircle2, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';

interface HomeroomReportProps {
  students: Student[];
  logs: EmulationLog[];
  currentWeek: number;
  onUpdateCurrentWeek: (week: number) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const HomeroomReport: React.FC<HomeroomReportProps> = ({
  students,
  logs,
  currentWeek,
  onUpdateCurrentWeek,
  showToast
}) => {
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);
  const top5Praise = sortedStudents.slice(0, 5);
  const top3Violations = [...students].sort((a, b) => a.score - b.score).slice(0, 3);

  // Group scores
  const groupScores: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const groupCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
  students.forEach(s => {
    groupScores[s.group] = (groupScores[s.group] || 0) + s.score;
    groupCounts[s.group] = (groupCounts[s.group] || 0) + 1;
  });

  const groupAvgs = [1, 2, 3, 4].map(gId => ({
    id: gId,
    name: `Tổ ${gId}`,
    avg: groupCounts[gId] > 0 ? Math.round(groupScores[gId] / groupCounts[gId]) : 0
  })).sort((a, b) => b.avg - a.avg);

  const bestGroup = groupAvgs[0];
  const worstGroup = groupAvgs[groupAvgs.length - 1];

  const handleCloseWeek = () => {
    if (window.confirm(`Bạn có chắc chắn muốn chốt điểm tuần ${currentWeek} và chuyển sang tuần mới không?`)) {
      sound.playFanfare();
      onUpdateCurrentWeek(currentWeek + 1);
      showToast(`Đã chốt điểm Tuần ${currentWeek} thành công! Hệ thống chuyển sang Tuần ${currentWeek + 1}.`, 'success');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2 backdrop-blur-md">
            <BarChart3 className="w-4 h-4 text-yellow-300" />
            BÁO CÁO SINH HOẠT LỚP (THỨ SÁU HÀNG TUẦN)
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Tổng Hợp Thi Đua Tuần {currentWeek}</h2>
          <p className="text-red-100 text-xs mt-1">Dữ liệu tự động tổng hợp phục vụ Giáo viên chủ nhiệm sinh hoạt lớp.</p>
        </div>

        <button
          onClick={handleCloseWeek}
          className="px-6 py-3 bg-white text-red-600 font-extrabold rounded-xl shadow-lg hover:bg-red-50 transition-all flex items-center gap-2 text-sm shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          CHỐT ĐIỂM & SANG TUẦN MỚI
        </button>
      </div>

      {/* Grid Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 Praise */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Tuyên dương (Top 5 Xuất sắc nhất)
          </h3>
          <div className="space-y-3">
            {top5Praise.map((s, idx) => (
              <div key={s.id} className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-500">Tổ {s.group} {s.role ? `· ${s.role}` : ''}</div>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                  {s.score} điểm
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Violations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Cần chấn chỉnh (Top 3 Vi phạm nhiều)
          </h3>
          <div className="space-y-3">
            {top3Violations.map((s, idx) => (
              <div key={s.id} className="p-3 bg-red-50/50 rounded-2xl border border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-500">Tổ {s.group}</div>
                  </div>
                </div>
                <span className="text-xs font-black text-red-700 bg-white px-2.5 py-1 rounded-md border border-red-200">
                  {s.score} điểm
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Group Assessment */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Đánh giá xếp loại các Tổ
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">👑 Tổ Nhất Tuần</div>
              <div className="text-lg font-black text-amber-900">{bestGroup.name}</div>
              <div className="text-xs text-amber-700 mt-0.5">Điểm trung bình: {bestGroup.avg} điểm</div>
            </div>
            <span className="text-3xl">🏆</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">⚠️ Tổ Cần Cố Gắng</div>
              <div className="text-lg font-black text-slate-900">{worstGroup.name}</div>
              <div className="text-xs text-slate-600 mt-0.5">Điểm trung bình: {worstGroup.avg} điểm</div>
            </div>
            <span className="text-3xl">💪</span>
          </div>
        </div>
      </div>
    </div>
  );
};
