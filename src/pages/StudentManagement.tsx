import React, { useState } from 'react';
import { Student } from '../types';
import { GraduationCap, Plus, Search, FileSpreadsheet, Edit3, Eye, Trash2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface StudentManagementProps {
  students: Student[];
  onUpdateStudents: (newStudents: Student[]) => void;
  onSelectStudent: (student: Student) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  userRole: string;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onUpdateStudents,
  onSelectStudent,
  showToast,
  userRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<number | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [group, setGroup] = useState(1);
  const [score, setScore] = useState(100);
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('👦');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === 'all' || s.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const handleOpenAdd = () => {
    sound.playClick();
    setName('');
    setGroup(1);
    setScore(100);
    setRole('');
    setAvatar('👦');
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    sound.playClick();
    setEditingStudent(s);
    setName(s.name);
    setGroup(s.group);
    setScore(s.score);
    setRole(s.role || '');
    setAvatar(s.avatar || '👦');
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playTing();

    if (editingStudent) {
      // Edit
      const updated = students.map(s => s.id === editingStudent.id ? { ...s, name, group, score, role, avatar } : s);
      onUpdateStudents(updated);
      showToast(`Đã cập nhật thông tin học sinh ${name}!`, 'success');
    } else {
      // Add new
      const newId = `HS${String(students.length + 1).padStart(2, '0')}`;
      const newStudent: Student = {
        id: newId,
        name,
        group,
        score,
        role,
        avatar,
        weeklyChange: 0
      };
      onUpdateStudents([newStudent, ...students]);
      showToast(`Đã thêm học sinh mới ${name} thành công!`, 'success');
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (userRole !== 'teacher') {
      showToast('Chỉ có Giáo viên chủ nhiệm mới có quyền xóa học sinh!', 'error');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi danh sách lớp?')) {
      sound.playClick();
      const updated = students.filter(s => s.id !== id);
      onUpdateStudents(updated);
      showToast('Đã xóa học sinh thành công.', 'info');
    }
  };

  const handleSimulateExcelImport = () => {
    sound.playClick();
    showToast('Đã import thành công 40 học sinh từ file Excel mẫu chuẩn!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-red-600" />
            Danh Sách Học Sinh Lớp 10A1 ({students.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Quản lý hồ sơ, phân tổ và điểm số của học sinh</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleSimulateExcelImport}
            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Import Excel Mẫu
          </button>
          {userRole === 'teacher' && (
            <button
              onClick={handleOpenAdd}
              className="flex-1 md:flex-none px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm Học Sinh
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute inset-y-0 left-3.5 my-auto w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc mã học sinh..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
          />
        </div>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="all">Tất cả các Tổ</option>
          <option value="1">Tổ 1</option>
          <option value="2">Tổ 2</option>
          <option value="3">Tổ 3</option>
          <option value="4">Tổ 4</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredStudents.map((student) => (
            <div key={student.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl overflow-hidden shrink-0 border border-slate-200">
                  {student.avatar && (student.avatar.startsWith('data:image') || student.avatar.startsWith('http')) ? (
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{student.avatar || '👦'}</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{student.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span className="font-mono text-slate-600">{student.id}</span>
                    <span>·</span>
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

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-extrabold text-slate-900 tabular-nums">{student.score} điểm</div>
                  <div className="text-[10px] text-slate-400">thi đua hiện tại</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectStudent(student);
                    }}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Xem hồ sơ"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {userRole === 'teacher' && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(student)}
                        className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                        title="Sửa thông tin"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Xóa học sinh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="p-6 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingStudent ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Tổ (1 - 4)</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value={1}>Tổ 1</option>
                    <option value={2}>Tổ 2</option>
                    <option value={3}>Tổ 3</option>
                    <option value={4}>Tổ 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Điểm ban đầu</label>
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Chức vụ (nếu có)</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="VD: Lớp trưởng, Cờ đỏ..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Ảnh đại diện / Avatar</label>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-2xl shrink-0">
                    {avatar.startsWith('data:image') || avatar.startsWith('http') ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{avatar}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all">
                      <span>Tải ảnh từ máy tính</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <p className="text-[10px] text-slate-400 mt-1">Chọn file ảnh JPG, PNG hoặc GIF dung lượng nhỏ.</p>
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-slate-600 mb-1">Hoặc chọn biểu tượng nhanh:</div>
                <div className="flex gap-2 flex-wrap">
                  {['👦', '👧', '⭐', '🦁', '🚀', '👑', '🦊', '🐱', '🐼', '🦄'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setAvatar(icon)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                        avatar === icon ? 'border-red-600 bg-red-50 ring-2 ring-red-600/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {editingStudent ? 'Cập nhật' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
