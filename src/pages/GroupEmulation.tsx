import React, { useState } from 'react';
import { Student } from '../types';
import { Users, Trophy, ChevronRight, Star, Award } from 'lucide-react';
import { sound } from '../utils/sound';

interface GroupEmulationProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const GroupEmulation: React.FC<GroupEmulationProps> = ({ students, onSelectStudent }) => {
  const [selectedGroupModal, setSelectedGroupModal] = useState<number | null>(null);

  const groups = [1, 2, 3, 4].map(gId => {
    const members = students.filter(s => s.group === gId);
    const totalScore = members.reduce((sum, s) => sum + s.score, 0);
    const avgScore = members.length > 0 ? Math.round(totalScore / members.length) : 0;
    const topMember = [...members].sort((a, b) => b.score - a.score)[0];
    return {
      id: gId,
      name: `Tổ ${gId}`,
      members,
      totalScore,
      avgScore,
      topMember
    };
  });

  // Sort groups by avg score descending
  const sortedGroups = [...groups].sort((a, b) => b.avgScore - a.avgScore);

  const groupDetailsModal = selectedGroupModal !== null ? groups.find(g => g.id === selectedGroupModal) : null;

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" />
            Thi đua các Tổ lớp 10A1
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Theo dõi điểm số tổng hợp và thành viên của 4 tổ trong lớp</p>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedGroups.map((g, idx) => {
          const isFirst = idx === 0;
          return (
            <div
              key={g.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                isFirst ? 'border-amber-400 ring-2 ring-amber-400/20 bg-gradient-to-br from-amber-50/40 to-white' : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl font-black text-lg flex items-center justify-center ${
                      isFirst ? 'bg-amber-400 text-white shadow-md' : 'bg-slate-900 text-white'
                    }`}>
                      {g.id}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                        {g.name} {isFirst && <span className="text-amber-500">👑</span>}
                      </h3>
                      <p className="text-xs text-slate-500">{g.members.length} thành viên</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900 tabular-nums">{g.avgScore}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Điểm trung bình</div>
                  </div>
                </div>

                {/* Top member of group */}
                {g.topMember && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⭐</span>
                      <div>
                        <div className="text-xs font-bold text-slate-800">Ngôi sao tổ: {g.topMember.name}</div>
                        <div className="text-[11px] text-slate-500">{g.topMember.score} điểm</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">Top 1 Tổ</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedGroupModal(g.id);
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                XEM CHI TIẾT THÀNH VIÊN TỔ
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Group Detail Modal */}
      {groupDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center">
                  {groupDetailsModal.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Chi tiết thành viên {groupDetailsModal.name}</h3>
                  <p className="text-xs text-slate-500">Tổng điểm: {groupDetailsModal.totalScore} · Điểm TB: {groupDetailsModal.avgScore}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedGroupModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6 divide-y divide-slate-100 flex-1 overflow-y-auto">
              {groupDetailsModal.members.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedGroupModal(null);
                    onSelectStudent(member);
                  }}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-xl px-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center text-xl shrink-0 border border-slate-200">
                      {member.avatar && (member.avatar.startsWith('data:image') || member.avatar.startsWith('http')) ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{member.avatar || '👦'}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{member.name}</div>
                      <div className="text-[10px] text-slate-500">{member.id} {member.role ? `· ${member.role}` : ''}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-slate-900 tabular-nums">{member.score} điểm</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedGroupModal(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
