import React, { useState } from 'react';
import { Student } from '../types';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, Search } from 'lucide-react';
import { sound } from '../utils/sound';

interface LeaderboardProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ students, onSelectStudent }) => {
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'semester'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<number | 'all'>('all');

  // Sort students by score descending
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  const filteredStudents = sortedStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === 'all' || s.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const top3 = sortedStudents.slice(0, 3);
  const restStudents = filteredStudents.slice(filterPeriod === 'week' && groupFilter === 'all' ? 3 : 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Bảng Xếp Hạng Thi Đua 10A1
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Vinh danh các cá nhân xuất sắc và thành tích thi đua lớp học</p>
        </div>

        {/* Period Selector & Group Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {(['week', 'month', 'semester'] as const).map((period) => (
              <button
                key={period}
                onClick={() => {
                  sound.playClick();
                  setFilterPeriod(period);
                }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filterPeriod === period
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period === 'week' ? 'Tuần này' : period === 'month' ? 'Tháng' : 'Học kỳ'}
              </button>
            ))}
          </div>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả các Tổ</option>
            <option value="1">Tổ 1</option>
            <option value="2">Tổ 2</option>
            <option value="3">Tổ 3</option>
            <option value="4">Tổ 4</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium (Only show when viewing all groups and week) */}
      {groupFilter === 'all' && searchQuery === '' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Top 2 (Silver) */}
          {top3[1] && (
            <div 
              onClick={() => {
                sound.playClick();
                onSelectStudent(top3[1]);
              }}
              className="bg-gradient-to-b from-slate-100 to-slate-200/50 p-6 rounded-3xl border border-slate-300 shadow-md flex flex-col items-center text-center relative cursor-pointer hover:scale-[1.02] transition-all order-2 md:order-1"
            >
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-300 text-slate-800 font-extrabold flex items-center justify-center text-xs shadow-sm">
                #2
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl mb-3 border-2 border-slate-300">
                {top3[1].avatar || '🥈'}
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white/80 px-2.5 py-0.5 rounded-full mb-1">
                <Medal className="w-3.5 h-3.5 text-slate-500" /> Hạng Nhì · Tổ {top3[1].group}
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{top3[1].name}</h3>
              {top3[1].role && <span className="text-[11px] text-slate-500 font-medium">{top3[1].role}</span>}
              <div className="mt-4 text-2xl font-black text-slate-800 tabular-nums">
                {top3[1].score} <span className="text-xs font-semibold text-slate-500">điểm</span>
              </div>
            </div>
          )}

          {/* Top 1 (Gold) */}
          {top3[0] && (
            <div 
              onClick={() => {
                sound.playClick();
                onSelectStudent(top3[0]);
              }}
              className="bg-gradient-to-b from-amber-50 to-yellow-100/60 p-6 rounded-3xl border-2 border-yellow-400 shadow-xl flex flex-col items-center text-center relative cursor-pointer hover:scale-105 transition-all order-1 md:order-2 md:-translate-y-4"
            >
              <div className="absolute -top-4 w-10 h-10 rounded-full bg-yellow-500 text-white font-black flex items-center justify-center text-sm shadow-lg">
                👑
              </div>
              <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center text-5xl mb-3 border-4 border-yellow-400">
                {top3[0].avatar || '🥇'}
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 bg-yellow-200/80 px-3 py-1 rounded-full mb-1">
                <Trophy className="w-4 h-4 text-yellow-600" /> Quán Quân · Tổ {top3[0].group}
              </div>
              <h3 className="text-lg font-black text-slate-900">{top3[0].name}</h3>
              {top3[0].role && <span className="text-xs text-amber-900 font-bold">{top3[0].role}</span>}
              <div className="mt-4 text-3xl font-black text-amber-700 tabular-nums">
                {top3[0].score} <span className="text-xs font-semibold text-slate-600">điểm</span>
              </div>
            </div>
          )}

          {/* Top 3 (Bronze) */}
          {top3[2] && (
            <div 
              onClick={() => {
                sound.playClick();
                onSelectStudent(top3[2]);
              }}
              className="bg-gradient-to-b from-amber-900/5 to-amber-900/10 p-6 rounded-3xl border border-amber-800/20 shadow-md flex flex-col items-center text-center relative cursor-pointer hover:scale-[1.02] transition-all order-3"
            >
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-amber-700 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
                #3
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl mb-3 border-2 border-amber-700">
                {top3[2].avatar || '🥉'}
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-white/80 px-2.5 py-0.5 rounded-full mb-1">
                <Award className="w-3.5 h-3.5 text-amber-700" /> Hạng Ba · Tổ {top3[2].group}
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{top3[2].name}</h3>
              {top3[2].role && <span className="text-[11px] text-slate-500 font-medium">{top3[2].role}</span>}
              <div className="mt-4 text-2xl font-black text-amber-900 tabular-nums">
                {top3[2].score} <span className="text-xs font-semibold text-slate-500">điểm</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Input for Leaderboard */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tên học sinh trong bảng xếp hạng..."
          className="w-full bg-transparent text-xs font-medium text-slate-900 focus:outline-none"
        />
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Danh sách xếp hạng chi tiết</h3>
          <span className="text-xs text-slate-500 font-medium">Tổng số: {filteredStudents.length} học sinh</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredStudents.map((student, index) => {
            const rank = sortedStudents.findIndex(s => s.id === student.id) + 1;
            const change = student.weeklyChange || 0;
            return (
              <div
                key={student.id}
                onClick={() => {
                  sound.playClick();
                  onSelectStudent(student);
                }}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 ${
                    rank === 1 ? 'bg-yellow-400 text-white shadow-sm' :
                    rank === 2 ? 'bg-slate-300 text-slate-800' :
                    rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {rank}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center text-xl shrink-0 border border-slate-200">
                    {student.avatar && (student.avatar.startsWith('data:image') || student.avatar.startsWith('http')) ? (
                      <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{student.avatar || '👦'}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      {student.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Tổ {student.group}</span>
                      {student.role && (
                        <>
                          <span>·</span>
                          <span className="text-red-600 font-semibold">{student.role}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Weekly change indicator */}
                  <div className="hidden sm:flex items-center gap-1 text-xs font-semibold">
                    {change > 0 ? (
                      <span className="text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> +{change}</span>
                    ) : change < 0 ? (
                      <span className="text-red-600 flex items-center gap-0.5"><TrendingDown className="w-3.5 h-3.5" /> {change}</span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-0.5"><Minus className="w-3.5 h-3.5" /> 0</span>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-slate-900 tabular-nums">{student.score}</div>
                    <div className="text-[10px] text-slate-400 font-medium">điểm thi đua</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
