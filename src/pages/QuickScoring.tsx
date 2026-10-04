import React, { useState } from 'react';
import { Student, Criteria, EmulationLog, User } from '../types';
import { Zap, CheckCircle2, Search, Plus, Minus, ShieldCheck, UserCheck } from 'lucide-react';
import { sound } from '../utils/sound';

interface QuickScoringProps {
  students: Student[];
  criteria: Criteria[];
  logs: EmulationLog[];
  user: User;
  onUpdateStudents: (newStudents: Student[]) => void;
  onUpdateLogs: (newLogs: EmulationLog[]) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const QuickScoring: React.FC<QuickScoringProps> = ({
  students,
  criteria,
  logs,
  user,
  onUpdateStudents,
  onUpdateLogs,
  showToast
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionType, setActionType] = useState<'bonus' | 'penalty'>('bonus');
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCriteria = criteria.filter(c => c.type === actionType);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveScoring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      showToast('Vui lòng chọn học sinh cần chấm điểm!', 'error');
      return;
    }
    if (!selectedCriteria) {
      showToast('Vui lòng chọn tiêu chí thi đua!', 'error');
      return;
    }

    const points = selectedCriteria.points; // positive or negative
    const actualChange = actionType === 'bonus' ? Math.abs(points) : -Math.abs(points);

    // Update student score
    const updatedStudents = students.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          score: s.score + actualChange
        };
      }
      return s;
    });

    // Create log entry
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newLog: EmulationLog = {
      id: `LOG-${Date.now()}`,
      time: timeStr,
      scorer: `${user.fullName} (${user.role === 'teacher' ? 'GVCN' : user.role === 'monitor' ? 'Lớp trưởng' : 'Cờ đỏ'})`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      criteriaId: selectedCriteria.id,
      criteriaName: selectedCriteria.name,
      pointsChange: actualChange,
      type: actionType
    };

    const updatedLogs = [newLog, ...logs];

    onUpdateStudents(updatedStudents);
    onUpdateLogs(updatedLogs);

    // Play sound & Toast
    if (actionType === 'bonus') {
      sound.playTing();
      showToast(`🟢 Thành công: Đã cộng ${Math.abs(actualChange)} điểm cho ${selectedStudent.name}!`, 'success');
    } else {
      sound.playBuzzer();
      showToast(`🔴 Cảnh báo: Đã trừ ${Math.abs(actualChange)} điểm của ${selectedStudent.name}!`, 'error');
    }

    // Reset selection for next quick score
    setSelectedCriteria(null);
    setSelectedStudent(null);
    setSearchQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 rounded-3xl text-white shadow-lg flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2 backdrop-blur-md">
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            MODULE CHẤM ĐIỂM NHANH (MOBILE OPTIMIZED)
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Cộng / Trừ Điểm Thi Đua Tức Thì</h2>
          <p className="text-red-100 text-xs mt-1">Chỉ với 3 bước chạm tay: Chọn học sinh &rarr; Chọn hành vi &rarr; Lưu kết quả.</p>
        </div>
      </div>

      <form onSubmit={handleSaveScoring} className="space-y-6">
        {/* Step 1: Select Student */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-extrabold flex items-center justify-center">1</span>
              Chọn Học Sinh
            </h3>
            {selectedStudent && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã chọn: {selectedStudent.name} (Tổ {selectedStudent.group})
              </span>
            )}
          </div>

          <div className="relative">
            <Search className="absolute inset-y-0 left-3.5 my-auto w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Gõ tên hoặc mã học sinh để tìm kiếm..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
          </div>

          {/* Student Quick Pills / List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
            {filteredStudents.map((s) => {
              const isSelected = selectedStudent?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedStudent(s);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-red-600 bg-red-50 ring-2 ring-red-600/20 font-bold text-red-950 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span className="text-xl">{s.avatar || '👦'}</span>
                  <div className="truncate flex-1">
                    <div className="text-xs font-bold truncate">{s.name}</div>
                    <div className="text-[10px] text-slate-500">Tổ {s.group} · {s.score}đ</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Action Type (Bonus / Penalty) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-extrabold flex items-center justify-center">2</span>
            Chọn Loại Hành Vi
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActionType('bonus');
                setSelectedCriteria(null);
              }}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all font-bold text-sm ${
                actionType === 'bonus'
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Plus className="w-5 h-5" />
              🟢 VIỆC TỐT / ĐIỂM CỘNG
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActionType('penalty');
                setSelectedCriteria(null);
              }}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-3 transition-all font-bold text-sm ${
                actionType === 'penalty'
                  ? 'border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Minus className="w-5 h-5" />
              🔴 VI PHẠM / ĐIỂM TRỪ
            </button>
          </div>
        </div>

        {/* Step 3: Select Criterion */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-extrabold flex items-center justify-center">3</span>
            Chọn Tiêu Chí Thi Đua
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCriteria.map((c) => {
              const isSelected = selectedCriteria?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedCriteria(c);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? actionType === 'bonus'
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20 text-emerald-950 font-bold shadow-xs'
                        : 'border-red-600 bg-red-50 ring-2 ring-red-600/20 text-red-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold pr-2">{c.name}</div>
                  <div className={`text-xs font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${
                    c.type === 'bonus' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {c.type === 'bonus' ? `+${c.points}` : `-${Math.abs(c.points)}`}đ
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Save Button */}
        <button
          type="submit"
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 text-base"
        >
          <CheckCircle2 className="w-6 h-6" />
          LƯU KẾT QUẢ CHẤM ĐIỂM
        </button>
      </form>
    </div>
  );
};
