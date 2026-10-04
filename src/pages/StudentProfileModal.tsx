import React, { useState } from 'react';
import { Student, EmulationLog } from '../types';
import { Trophy, Award, Clock, X, Shield, Plus, Minus, Edit3, Check } from 'lucide-react';
import { sound } from '../utils/sound';

interface StudentProfileModalProps {
  student: Student;
  logs: EmulationLog[];
  onClose: () => void;
  onUpdateStudent: (updated: Student) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const AVATAR_PRESETS = ['👦', '👧', '⭐', '🦁', '🚀', '👑', '🦊', '🐱', '🐼', '🐯', '🦄', '⚡', '🎨', '🏆', '👨‍🎓', '👩‍🎓'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  logs,
  onClose,
  onUpdateStudent,
  showToast
}) => {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [customAvatar, setCustomAvatar] = useState(student.avatar || '👦');

  const studentLogs = logs.filter(l => l.studentId === student.id);

  const handleSelectAvatar = (avatar: string) => {
    sound.playClick();
    setCustomAvatar(avatar);
    const updated = { ...student, avatar };
    onUpdateStudent(updated);
    showToast(`Đã thay đổi avatar của ${student.name} thành ${avatar}!`, 'success');
    setIsEditingAvatar(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 flex flex-col">
        {/* Header Profile */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white relative">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg overflow-hidden flex items-center justify-center text-4xl border-2 border-white/40 cursor-pointer"
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                title="Click để đổi avatar"
              >
                {student.avatar && (student.avatar.startsWith('data:image') || student.avatar.startsWith('http')) ? (
                  <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{student.avatar || '👦'}</span>
                )}
              </div>
              <button
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-1.5 rounded-full shadow-md hover:bg-slate-800 transition-all text-xs"
                title="Đổi avatar"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-1 backdrop-blur-md">
                Tổ {student.group} · Mã HS: {student.id}
              </div>
              <h2 className="text-xl font-black">{student.name}</h2>
              {student.role && <div className="text-xs text-red-100 font-semibold">{student.role}</div>}
            </div>
          </div>

          {/* Avatar Picker Drawer */}
          {isEditingAvatar && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white uppercase tracking-wider">Tải ảnh từ máy tính:</div>
                <label className="cursor-pointer px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-100 transition-all">
                  <span>Chọn file ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const res = reader.result as string;
                          const updated = { ...student, avatar: res };
                          onUpdateStudent(updated);
                          showToast(`Đã cập nhật ảnh đại diện mới cho ${student.name}!`, 'success');
                          setIsEditingAvatar(false);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-xs font-bold text-white uppercase tracking-wider pt-2 border-t border-white/20">Hoặc chọn biểu tượng nhanh:</div>
              <div className="grid grid-cols-8 gap-2">
                {AVATAR_PRESETS.map((av) => (
                  <button
                    key={av}
                    onClick={() => handleSelectAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all bg-white/20 hover:bg-white/40 border ${
                      student.avatar === av ? 'border-yellow-300 ring-2 ring-yellow-300' : 'border-transparent'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <div className="text-[10px] text-red-100 uppercase tracking-wider font-bold">Tổng điểm thi đua</div>
              <div className="text-2xl font-black text-yellow-300 tabular-nums">{student.score} điểm</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <div className="text-[10px] text-red-100 uppercase tracking-wider font-bold">Thay đổi tuần này</div>
              <div className="text-2xl font-black text-white tabular-nums">
                {student.weeklyChange !== undefined ? (student.weeklyChange >= 0 ? `+${student.weeklyChange}` : student.weeklyChange) : '+0'}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline History */}
        <div className="p-6 space-y-4 flex-1">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600" />
            Lịch sử chấm điểm cá nhân ({studentLogs.length})
          </h3>

          <div className="space-y-3">
            {studentLogs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">Chưa có ghi nhận cộng trừ điểm nào cho học sinh này.</div>
            ) : (
              studentLogs.map((log) => (
                <div key={log.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      log.type === 'bonus' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {log.type === 'bonus' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{log.criteriaName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {log.time} · Người chấm: <span className="font-semibold text-slate-700">{log.scorer}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg shrink-0 ${
                    log.type === 'bonus' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {log.pointsChange > 0 ? `+${log.pointsChange}` : log.pointsChange}đ
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};
