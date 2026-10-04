import React, { useState, useRef } from 'react';
import { Student } from '../types';
import { sound } from '../utils/sound';
import { 
  Dices, 
  Sparkles, 
  RotateCw, 
  Crown, 
  Users, 
  Award, 
  CheckCircle2, 
  Filter, 
  Shuffle, 
  HelpCircle,
  Trophy,
  Star,
  UserCheck
} from 'lucide-react';

interface RandomPickerProps {
  students: Student[];
  currentWeek: number;
}

export const RandomPicker: React.FC<RandomPickerProps> = ({ students, currentWeek }) => {
  const [subTab, setSubTab] = useState<'group_picker' | 'wheel' | 'lottery' | 'secret_card'>('group_picker');
  const [scope, setScope] = useState<string>('all'); // 'all', 'group1', 'group2', 'group3', 'group4'

  // States for Group Picker (Bốc Thăm Tổ & Gọi Tên)
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [isPickingGroup, setIsPickingGroup] = useState<boolean>(false);
  const [isPickingStudent, setIsPickingStudent] = useState<boolean>(false);
  const [tempStudentName, setTempStudentName] = useState<string>('---');
  const [winner, setWinner] = useState<Student | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);

  // States for Lucky Wheel
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [wheelWinner, setWheelWinner] = useState<Student | null>(null);
  const [showWheelModal, setShowWheelModal] = useState<boolean>(false);

  // States for Student Lottery
  const [lotteryWinner, setLotteryWinner] = useState<Student | null>(null);
  const [isLotteryRunning, setIsLotteryRunning] = useState<boolean>(false);
  const [displayLotteryName, setDisplayLotteryName] = useState<string>('Nhấn Bắt Đầu...');

  // States for Secret Card
  const [cards, setCards] = useState<{ id: number; student: Student; flipped: boolean }[]>([]);
  const [selectedSecretStudent, setSelectedSecretStudent] = useState<Student | null>(null);

  // Filter students based on scope
  const getFilteredStudents = () => {
    if (scope === 'all') return students;
    const groupNum = parseInt(scope.replace('group', ''));
    return students.filter(s => s.group === groupNum);
  };

  const activeStudents = getFilteredStudents();

  // Handle Group & Student Draw
  const handleGroupAndStudentPick = () => {
    if (students.length === 0) {
      alert('Không có học sinh nào trong hệ thống!');
      return;
    }

    sound.playClick();
    setIsPickingGroup(true);
    setSelectedGroup(null);
    setWinner(null);
    setTempStudentName('Đang chọn Tổ...');

    let groupCounter = 0;
    const groupInterval = setInterval(() => {
      const randGrp = Math.floor(Math.random() * 4) + 1;
      setSelectedGroup(randGrp);
      groupCounter++;
      sound.playClick();

      if (groupCounter > 12) {
        clearInterval(groupInterval);
        // Final Winning Group
        const finalGroup = Math.floor(Math.random() * 4) + 1;
        setSelectedGroup(finalGroup);
        setIsPickingGroup(false);
        
        // Start Step 2: Pick Student from winning group
        startStudentRoulette(finalGroup);
      }
    }, 120);
  };

  const startStudentRoulette = (groupNum: number) => {
    const groupStudents = students.filter(s => s.group === groupNum);
    if (groupStudents.length === 0) {
      alert(`Tổ ${groupNum} không có học sinh nào!`);
      return;
    }

    setIsPickingStudent(true);
    let studentCounter = 0;
    const studentInterval = setInterval(() => {
      const randStudent = groupStudents[Math.floor(Math.random() * groupStudents.length)];
      setTempStudentName(randStudent.name);
      studentCounter++;
      sound.playClick();

      if (studentCounter > 18) {
        clearInterval(studentInterval);
        const finalWinner = groupStudents[Math.floor(Math.random() * groupStudents.length)];
        setTempStudentName(finalWinner.name);
        setWinner(finalWinner);
        setIsPickingStudent(false);
        setShowWinnerModal(true);
        sound.playTing();
      }
    }, 90);
  };

  // Handle Lucky Wheel Spin
  const spinWheel = () => {
    if (activeStudents.length === 0) {
      alert('Không có học sinh trong phạm vi đã chọn!');
      return;
    }
    if (isSpinning) return;

    sound.playClick();
    setIsSpinning(true);
    setWheelWinner(null);

    const winningIndex = Math.floor(Math.random() * activeStudents.length);
    const sliceAngle = 360 / activeStudents.length;
    // 5 full rotations + target slice offset
    const randomExtraRotations = 360 * 5;
    const targetRotation = wheelRotation + randomExtraRotations + (360 - (winningIndex * sliceAngle + sliceAngle / 2));

    setWheelRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = activeStudents[winningIndex];
      setWheelWinner(chosen);
      setShowWheelModal(true);
      sound.playTing();
    }, 4000);
  };

  // Handle Student Lottery
  const startLottery = () => {
    if (activeStudents.length === 0) {
      alert('Không có học sinh trong phạm vi đã chọn!');
      return;
    }

    sound.playClick();
    setIsLotteryRunning(true);
    setLotteryWinner(null);

    let counter = 0;
    const interval = setInterval(() => {
      const rand = activeStudents[Math.floor(Math.random() * activeStudents.length)];
      setDisplayLotteryName(`${rand.avatar} ${rand.name} (Tổ ${rand.group})`);
      counter++;
      sound.playClick();

      if (counter > 25) {
        clearInterval(interval);
        const finalWinner = activeStudents[Math.floor(Math.random() * activeStudents.length)];
        setDisplayLotteryName(`${finalWinner.avatar} ${finalWinner.name} (Tổ ${finalWinner.group})`);
        setLotteryWinner(finalWinner);
        setIsLotteryRunning(false);
        sound.playTing();
      }
    }, 80);
  };

  // Initialize Secret Cards
  const initSecretCards = () => {
    const shuffled = [...activeStudents].sort(() => 0.5 - Math.random()).slice(0, Math.min(8, activeStudents.length));
    setCards(shuffled.map((s, idx) => ({ id: idx, student: s, flipped: false })));
    setSelectedSecretStudent(null);
    sound.playClick();
  };

  React.useEffect(() => {
    if (activeStudents.length > 0) {
      initSecretCards();
    }
  }, [scope, students]);

  const flipCard = (cardId: number) => {
    sound.playClick();
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        setSelectedSecretStudent(c.student);
        sound.playTing();
        return { ...c, flipped: true };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header & Title */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cover opacity-10 bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1000')` }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Hoạt động lớp học tương tác · Tuần {currentWeek}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Vòng Quay & Gọi Tên Ngẫu Nhiên</h1>
            <p className="text-sm text-indigo-200 mt-1">Sổ tay thi đua lớp 10A1 · Trường THPT Xuân Giang</p>
          </div>

          {/* Scope Filter Dropdown */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <Filter className="w-4 h-4 text-indigo-300 ml-1" />
            <span className="text-xs font-medium text-indigo-200">Phạm vi:</span>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="bg-slate-800 text-white text-xs font-semibold rounded-xl px-3 py-2 border border-slate-700 outline-none cursor-pointer"
            >
              <option value="all">Toàn bộ học sinh ({students.length})</option>
              <option value="group1">Tổ 1 ({students.filter(s => s.group === 1).length})</option>
              <option value="group2">Tổ 2 ({students.filter(s => s.group === 2).length})</option>
              <option value="group3">Tổ 3 ({students.filter(s => s.group === 3).length})</option>
              <option value="group4">Tổ 4 ({students.filter(s => s.group === 4).length})</option>
            </select>
          </div>
        </div>

        {/* Scrollable Tabs Menu */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => { sound.playClick(); setSubTab('group_picker'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-md ${
              subTab === 'group_picker' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30' 
                : 'bg-white/10 hover:bg-white/20 text-indigo-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Gọi Theo Tổ & HS
          </button>
          <button
            onClick={() => { sound.playClick(); setSubTab('wheel'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-md ${
              subTab === 'wheel' 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-500/30' 
                : 'bg-white/10 hover:bg-white/20 text-indigo-100'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            Vòng Quay May Mắn
          </button>
          <button
            onClick={() => { sound.playClick(); setSubTab('lottery'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-md ${
              subTab === 'lottery' 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/30' 
                : 'bg-white/10 hover:bg-white/20 text-indigo-100'
            }`}
          >
            <Dices className="w-4 h-4" />
            Xổ Số Tên HS
          </button>
          <button
            onClick={() => { sound.playClick(); setSubTab('secret_card'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-md ${
              subTab === 'secret_card' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/30' 
                : 'bg-white/10 hover:bg-white/20 text-indigo-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Lật Thẻ Bí Mật
          </button>
        </div>
      </div>

      {/* TAB 1: GROUP & STUDENT PICKER (BỐC THĂM TỔ & GỌI TÊN) */}
      {subTab === 'group_picker' && (
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 text-center space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">Bốc Thăm Tổ & Gọi Tên</h2>
            <p className="text-slate-500 text-sm mt-1">Hệ thống sẽ ngẫu nhiên chọn Tổ may mắn trước, sau đó chọn tiếp học sinh xuất sắc trong tổ đó!</p>
          </div>

          {/* 4 Cards for 4 Groups */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(grp => {
              const isSelected = selectedGroup === grp;
              const groupCount = students.filter(s => s.group === grp).length;
              return (
                <div
                  key={grp}
                  className={`relative p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                    isSelected 
                      ? 'bg-emerald-50 border-emerald-500 shadow-xl shadow-emerald-500/20 scale-105' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-3 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider animate-bounce">
                      Đang chọn
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
                  }`}>
                    T{grp}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-800 text-base">Tổ {grp}</div>
                    <div className="text-xs text-slate-500 font-medium">{groupCount} học sinh</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Display Box */}
          <div className="max-w-md mx-auto bg-slate-900 text-white p-6 rounded-3xl shadow-inner border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Học sinh được gọi tên</div>
            <div className="text-2xl md:text-3xl font-black text-yellow-300 tracking-tight py-2 min-h-[60px] flex items-center justify-center">
              {tempStudentName}
            </div>
            {selectedGroup && (
              <div className="text-xs font-medium text-emerald-400">
                Thuộc Tổ {selectedGroup}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={handleGroupAndStudentPick}
              disabled={isPickingGroup || isPickingStudent}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-black text-base md:text-lg shadow-xl transition-all transform active:scale-95 ${
                isPickingGroup || isPickingStudent
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/40'
              }`}
            >
              <Crown className="w-6 h-6 text-yellow-300 animate-pulse" />
              {isPickingGroup ? 'Đang chọn Tổ...' : isPickingStudent ? 'Đang gọi tên HS...' : 'BỐC THĂM TỔ & GỌI TÊN'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: LUCKY WHEEL (VÒNG QUAY MAY MẮN) */}
      {subTab === 'wheel' && (
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 flex flex-col items-center justify-center space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">Vòng Quay May Mắn</h2>
            <p className="text-slate-500 text-sm mt-1">Quay vòng tròn để chọn ngẫu nhiên học sinh trong phạm vi ({activeStudents.length} học sinh)</p>
          </div>

          {/* Wheel Container */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
            {/* Pointer / Arrow */}
            <div className="absolute -top-4 z-30 w-8 h-10 bg-red-600 clip-triangle shadow-lg transform -translate-y-1/2 border-2 border-white rounded-t-md" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
            
            {/* Rotating Wheel */}
            <div
              className="w-full h-full rounded-full border-8 border-slate-900 shadow-2xl relative overflow-hidden transition-all duration-[4000ms] ease-out"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                background: `conic-gradient(
                  #4f46e5 0deg 90deg,
                  #06b6d4 90deg 180deg,
                  #10b981 180deg 270deg,
                  #f59e0b 270deg 360deg
                )`
              }}
            >
              {activeStudents.map((s, idx) => {
                const angle = (idx * 360) / activeStudents.length;
                return (
                  <div
                    key={s.id}
                    className="absolute top-1/2 left-1/2 text-white font-bold text-xs origin-left whitespace-nowrap"
                    style={{
                      transform: `rotate(${angle}deg) translate(20px, -50%)`,
                      maxWidth: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {s.avatar} {s.name}
                  </div>
                );
              })}
            </div>

            {/* Center Hub */}
            <div className="absolute z-20 w-16 h-16 rounded-full bg-slate-900 border-4 border-white shadow-xl flex items-center justify-center text-yellow-300 font-black text-sm">
              10A1
            </div>
          </div>

          {/* Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || activeStudents.length === 0}
            className={`px-8 py-4 rounded-2xl text-white font-black text-lg shadow-xl transition-all ${
              isSpinning 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/40'
            }`}
          >
            {isSpinning ? 'Đang Quay...' : 'QUAY NGAY 🎯'}
          </button>
        </div>
      )}

      {/* TAB 3: STUDENT LOTTERY (XỔ SỐ TÊN HS) */}
      {subTab === 'lottery' && (
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 text-center space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">Xổ Số Tên Học Sinh</h2>
            <p className="text-slate-500 text-sm mt-1">Bốc thăm ngẫu nhiên học sinh may mắn từ danh sách đã lọc</p>
          </div>

          <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">Kết quả xổ số</div>
            <div className="text-3xl md:text-4xl font-black text-yellow-300 py-4 min-h-[90px] flex items-center justify-center">
              {displayLotteryName}
            </div>
          </div>

          <button
            onClick={startLottery}
            disabled={isLotteryRunning || activeStudents.length === 0}
            className={`px-8 py-4 rounded-2xl text-white font-black text-lg shadow-xl transition-all ${
              isLotteryRunning 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/40'
            }`}
          >
            {isLotteryRunning ? 'Đang quay số...' : 'BẮT ĐẦU XỔ SỐ 🎟️'}
          </button>
        </div>
      )}

      {/* TAB 4: SECRET CARDS (LẬT THẺ BÍ MẬT) */}
      {subTab === 'secret_card' && (
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 text-center space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800">Lật Thẻ Bí Mật</h2>
              <p className="text-slate-500 text-sm mt-1">Chọn một thẻ ngẫu nhiên để gọi tên học sinh</p>
            </div>
            <button
              onClick={initSecretCards}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
            >
              <Shuffle className="w-4 h-4" /> Trộn lại thẻ
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {cards.map(card => (
              <div
                key={card.id}
                onClick={() => !card.flipped && flipCard(card.id)}
                className={`h-40 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-lg border-2 ${
                  card.flipped
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-indigo-500/30 scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                {card.flipped ? (
                  <div className="text-center space-y-2 animate-in zoom-in duration-200">
                    <div className="text-3xl">{card.student.avatar}</div>
                    <div className="font-black text-white text-base">{card.student.name}</div>
                    <div className="text-xs text-indigo-200">Tổ {card.student.group}</div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-300 mx-auto text-xl font-black">
                      ?
                    </div>
                    <div className="text-xs font-semibold text-slate-400">Thẻ số {card.id + 1}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedSecretStudent && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto flex items-center gap-4 animate-in fade-in duration-200">
              <div className="text-3xl">{selectedSecretStudent.avatar}</div>
              <div className="text-left">
                <div className="text-xs font-semibold text-emerald-600 uppercase">Học sinh được lật chọn</div>
                <div className="text-lg font-black text-slate-800">{selectedSecretStudent.name} - Tổ {selectedSecretStudent.group}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WINNER CELEBRATION MODAL (FOR GROUP & STUDENT PICK) */}
      {showWinnerModal && winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 text-center p-8 space-y-6 relative">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-4xl transform translate-y-8 border-4 border-white">
                {winner.avatar}
              </div>
            </div>

            <div className="pt-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                <Trophy className="w-3.5 h-3.5" /> Chúc Mừng Chiến Thắng!
              </div>
              <h3 className="text-2xl font-black text-slate-800">{winner.name}</h3>
              <p className="text-sm font-semibold text-slate-500">Tổ {winner.group} · Vai trò: {winner.role || 'Thành viên'}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-around text-center">
              <div>
                <div className="text-xs text-slate-400 font-medium">Điểm hiện tại</div>
                <div className="text-xl font-black text-emerald-600">{winner.score}đ</div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-xs text-slate-400 font-medium">Biến động tuần</div>
                <div className="text-xl font-black text-indigo-600">+{winner.weeklyChange || 0}</div>
              </div>
            </div>

            <button
              onClick={() => { sound.playClick(); setShowWinnerModal(false); }}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm shadow-lg transition-all"
            >
              TIẾP TỤC QUAY GỌI ✨
            </button>
          </div>
        </div>
      )}

      {/* WHEEL WINNER MODAL */}
      {showWheelModal && wheelWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 text-center p-8 space-y-6 relative">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-4xl transform translate-y-8 border-4 border-white">
                {wheelWinner.avatar}
              </div>
            </div>

            <div className="pt-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5" /> Vòng Quay May Mắn
              </div>
              <h3 className="text-2xl font-black text-slate-800">{wheelWinner.name}</h3>
              <p className="text-sm font-semibold text-slate-500">Tổ {wheelWinner.group}</p>
            </div>

            <button
              onClick={() => { sound.playClick(); setShowWheelModal(false); }}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm shadow-lg transition-all"
            >
              TUYỆT VỜI 🎉
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
