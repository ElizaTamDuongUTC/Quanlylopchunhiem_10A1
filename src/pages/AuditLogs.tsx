import React from 'react';
import { EmulationLog, Student } from '../types';
import { History, Undo2, Plus, Minus, Shield } from 'lucide-react';
import { sound } from '../utils/sound';

interface AuditLogsProps {
  logs: EmulationLog[];
  students: Student[];
  onUpdateLogs: (newLogs: EmulationLog[]) => void;
  onUpdateStudents: (newStudents: Student[]) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  userRole: string;
}

export const AuditLogs: React.FC<AuditLogsProps> = ({
  logs,
  students,
  onUpdateLogs,
  onUpdateStudents,
  showToast,
  userRole
}) => {
  const handleRevertLog = (logId: string) => {
    if (userRole !== 'teacher') {
      showToast('Chỉ có Giáo viên chủ nhiệm mới có quyền hủy bỏ thao tác chấm điểm!', 'error');
      return;
    }

    const logToRevert = logs.find(l => l.id === logId);
    if (!logToRevert || logToRevert.isReverted) return;

    if (window.confirm(`Bạn có chắc chắn muốn HỦY BỎ thao tác này? Điểm của học sinh ${logToRevert.studentName} sẽ được hoàn lại.`)) {
      sound.playClick();

      // Reverse point change on student
      const reverseChange = -logToRevert.pointsChange;
      const updatedStudents = students.map(s => {
        if (s.id === logToRevert.studentId) {
          return {
            ...s,
            score: s.score + reverseChange
          };
        }
        return s;
      });

      // Mark log as reverted
      const updatedLogs = logs.map(l => l.id === logId ? { ...l, isReverted: true } : l);

      onUpdateStudents(updatedStudents);
      onUpdateLogs(updatedLogs);
      showToast(`Đã hủy bỏ thao tác thành công. Đã hoàn lại điểm cho ${logToRevert.studentName}!`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-red-600" />
            Nhật Ký & Lịch Sử Chấm Điểm
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Toàn bộ lịch sử cộng trừ điểm của hệ thống theo thời gian thực</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">Chưa có bản ghi lịch sử nào.</div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id} 
                className={`px-6 py-4 flex items-center justify-between transition-colors ${log.isReverted ? 'bg-slate-100/60 opacity-60' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    log.type === 'bonus' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {log.type === 'bonus' ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{log.studentName}</span>
                      <span className="text-[11px] font-normal text-slate-500">({log.criteriaName})</span>
                      {log.isReverted && <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">ĐÃ HỦY BỎ</span>}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{log.time}</span>
                      <span>·</span>
                      <span>Người chấm: <strong className="text-slate-700">{log.scorer}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`text-sm font-extrabold px-3 py-1 rounded-lg tabular-nums ${
                    log.type === 'bonus' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {log.pointsChange > 0 ? `+${log.pointsChange}` : log.pointsChange}đ
                  </div>

                  {userRole === 'teacher' && !log.isReverted && (
                    <button
                      onClick={() => handleRevertLog(log.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                      title="Hủy bỏ thao tác này"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      Hủy bỏ
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
