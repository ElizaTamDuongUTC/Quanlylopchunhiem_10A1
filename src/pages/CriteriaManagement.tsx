import React, { useState } from 'react';
import { Criteria } from '../types';
import { ListTree, Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface CriteriaManagementProps {
  criteria: Criteria[];
  onUpdateCriteria: (newCriteria: Criteria[]) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const CriteriaManagement: React.FC<CriteriaManagementProps> = ({
  criteria,
  onUpdateCriteria,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'bonus' | 'penalty'>('bonus');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<Criteria | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<'bonus' | 'penalty'>('bonus');
  const [points, setPoints] = useState(5);

  const filteredCriteria = criteria.filter(c => c.type === activeTab);

  const handleOpenAdd = () => {
    sound.playClick();
    setName('');
    setType(activeTab);
    setPoints(activeTab === 'bonus' ? 5 : 5);
    setEditingCriterion(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Criteria) => {
    sound.playClick();
    setEditingCriterion(c);
    setName(c.name);
    setType(c.type);
    setPoints(Math.abs(c.points));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playTing();

    const actualPoints = type === 'bonus' ? Math.abs(points) : -Math.abs(points);

    if (editingCriterion) {
      const updated = criteria.map(c => c.id === editingCriterion.id ? { ...c, name, type, points: actualPoints } : c);
      onUpdateCriteria(updated);
      showToast('Đã cập nhật tiêu chí thi đua thành công!', 'success');
    } else {
      const newId = `TC${String(criteria.length + 1).padStart(2, '0')}`;
      const newCriterion: Criteria = {
        id: newId,
        name,
        type,
        points: actualPoints
      };
      onUpdateCriteria([...criteria, newCriterion]);
      showToast('Đã thêm tiêu chí thi đua mới thành công!', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tiêu chí thi đua này?')) {
      sound.playClick();
      const updated = criteria.filter(c => c.id !== id);
      onUpdateCriteria(updated);
      showToast('Đã xóa tiêu chí.', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <ListTree className="w-6 h-6 text-red-600" />
            Quản Lý Tiêu Chí Thi Đua
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Cấu hình các lỗi vi phạm và việc tốt để chấm điểm</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm Tiêu Chí Mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs max-w-md">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('bonus');
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'bonus'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🟢 ĐIỂM CỘNG ({criteria.filter(c => c.type === 'bonus').length})
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('penalty');
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'penalty'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🔴 ĐIỂM TRỪ ({criteria.filter(c => c.type === 'penalty').length})
        </button>
      </div>

      {/* Criteria Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredCriteria.map((c) => (
            <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                  c.type === 'bonus' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {c.id}
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{c.name}</div>
                  <div className="text-[11px] text-slate-500">{c.type === 'bonus' ? 'Hành vi biểu dương / Thưởng điểm' : 'Hành vi vi phạm / Trừ điểm'}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`text-sm font-extrabold px-3 py-1 rounded-lg tabular-nums ${
                  c.type === 'bonus' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {c.type === 'bonus' ? `+${c.points}` : `-${Math.abs(c.points)}`}đ
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="p-6 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingCriterion ? 'Sửa tiêu chí thi đua' : 'Thêm tiêu chí thi đua mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Tên tiêu chí / Hành vi</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Mặc sai đồng phục..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Loại tiêu chí</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'bonus' | 'penalty')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="bonus">Điểm cộng</option>
                    <option value="penalty">Điểm trừ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Số điểm</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    min={1}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingCriterion ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
