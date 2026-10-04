import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types';
import { sound } from '../utils/sound';
import { 
  Wrench, 
  Clock, 
  Users, 
  Dices, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Sparkles,
  Volume2,
  ShieldAlert
} from 'lucide-react';

interface ClassroomUtilitiesProps {
  students: Student[];
  currentWeek: number;
}

export const ClassroomUtilities: React.FC<ClassroomUtilitiesProps> = ({ students, currentWeek }) => {
  const [activeSubTab, setActiveSubTab] = useState<'timer' | 'groups' | 'dice' | 'traffic'>('timer');

  // --- TIMER STATE ---
  const [totalSeconds, setTotalSeconds] = useState<number>(300); // Default 5 minutes (300s)
  const [initialSeconds, setInitialSeconds] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [customMin, setCustomMin] = useState<string>('5');
  const [customSec, setCustomSec] = useState<string>('0');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            sound.playTing();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainderSecs).padStart(2, '0')}`;
  };

  const handleSelectQuickTime = (seconds: number) => {
    sound.playClick();
    setIsRunning(false);
    setTotalSeconds(seconds);
    setInitialSeconds(seconds);
    setCustomMin(Math.floor(seconds / 60).toString());
    setCustomSec((seconds % 60).toString());
  };

  const handleApplyCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const m = parseInt(customMin) || 0;
    const s = parseInt(customSec) || 0;
    const total = m * 60 + s;
    if (total <= 0) {
      alert('Vui lòng nhập thời gian lớn hơn 0!');
      return;
    }
    setIsRunning(false);
    setTotalSeconds(total);
    setInitialSeconds(total);
  };

  const toggleTimer = () => {
    sound.playClick();
    if (totalSeconds <= 0) return;
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTotalSeconds(initialSeconds);
  };

  // --- DICE ROLLER STATE ---
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceValues, setDiceValues] = useState<number[]>([1, 6]);
  const [isRollingDice, setIsRollingDice] = useState<boolean>(false);

  const rollDice = () => {
    sound.playClick();
    setIsRollingDice(true);
    let count = 0;
    const interval = setInterval(() => {
      const newVals = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
      setDiceValues(newVals);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setIsRollingDice(false);
        sound.playTing();
      }
    }, 80);
  };

  // --- TRAFFIC LIGHT STATE ---
  const [trafficState, setTrafficState] = useState<'red' | 'yellow' | 'green'>('green');

  // --- GROUP GENERATOR STATE ---
  const [groupSize, setGroupSize] = useState<number>(4);
  const [generatedGroups, setGeneratedGroups] = useState<Student[][]>([]);

  const handleGenerateGroups = () => {
    sound.playClick();
    const shuffled = [...students].sort(() => 0.5 - Math.random());
    const result: Student[][] = [];
    for (let i = 0; i < shuffled.length; i += groupSize) {
      result.push(shuffled.slice(i, i + groupSize));
    }
    setGeneratedGroups(result);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header & Title */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cover opacity-10 bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000')` }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/40">
              <Wrench className="w-7 h-7 text-yellow-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-1 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Công cụ giáo viên · Tuần {currentWeek}
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Tiện Ích Hỗ Trợ Lớp Học</h1>
              <p className="text-xs text-emerald-200 mt-0.5">Sổ tay thi đua lớp 10A1 · Trường THPT Xuân Giang</p>
            </div>
          </div>
        </div>

        {/* Scrollable Tabs Menu */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('timer'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-md ${
              activeSubTab === 'timer' 
                ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                : 'bg-white/10 hover:bg-white/20 text-emerald-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            Đồng Hồ Lớp Học
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('groups'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-md ${
              activeSubTab === 'groups' 
                ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                : 'bg-white/10 hover:bg-white/20 text-emerald-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Chia Nhóm Ngẫu Nhiên
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('dice'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-md ${
              activeSubTab === 'dice' 
                ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                : 'bg-white/10 hover:bg-white/20 text-emerald-100'
            }`}
          >
            <Dices className="w-4 h-4" />
            Xúc Xắc Thưởng Phạt
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('traffic'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shadow-md ${
              activeSubTab === 'traffic' 
                ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                : 'bg-white/10 hover:bg-white/20 text-emerald-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            Đèn Tín Hiệu Kỷ Luật
          </button>
        </div>
      </div>

      {/* TAB 1: TIMER (ĐỒNG HỒ BẤM GIỜ & ĐẾM NGƯỢC) */}
      {activeSubTab === 'timer' && (
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-slate-100 flex flex-col items-center justify-center space-y-8 max-w-3xl mx-auto">
          
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-800">Đồng Hồ Bấm Giờ & Đếm Ngược</h2>
            <p className="text-slate-500 text-sm mt-1">Quản lý thời gian hoạt động, thảo luận và làm bài tập của lớp</p>
          </div>

          {/* Main Digital Clock Display */}
          <div className="w-full bg-slate-950 text-emerald-400 p-8 md:p-12 rounded-3xl shadow-2xl border-4 border-slate-800 text-center relative overflow-hidden">
            <div className="absolute top-3 left-4 text-xs font-mono text-slate-500 uppercase tracking-widest">Countdown Timer</div>
            <div className="text-6xl md:text-8xl font-black font-mono tracking-wider drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              {formatTime(totalSeconds)}
            </div>
            {totalSeconds === 0 && (
              <div className="mt-2 text-red-400 font-bold text-sm animate-pulse">⏰ Hết thời gian!</div>
            )}
          </div>

          {/* Quick Select Buttons (Pill-shaped) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: '30 giây', secs: 30 },
              { label: '1 phút', secs: 60 },
              { label: '1 phút 30 giây', secs: 90 },
              { label: '3 phút', secs: 180 },
              { label: '5 phút', secs: 300 },
              { label: '10 phút', secs: 600 }
            ].map(item => (
              <button
                key={item.secs}
                onClick={() => handleSelectQuickTime(item.secs)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                  initialSeconds === item.secs && !isRunning
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Custom Time Form */}
          <form onSubmit={handleApplyCustomTime} className="flex flex-wrap items-center justify-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 w-full">
            <span className="text-xs font-bold text-slate-700">Tự chỉnh thời gian:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="120"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-16 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-center text-sm font-bold text-slate-800 outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-slate-500">phút</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="59"
                value={customSec}
                onChange={(e) => setCustomSec(e.target.value)}
                className="w-16 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-center text-sm font-bold text-slate-800 outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-slate-500">giây</span>
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Áp Dụng
            </button>
          </form>

          {/* Control Buttons (Bắt Đầu & Đặt Lại) */}
          <div className="flex items-center justify-center gap-4 w-full">
            <button
              onClick={toggleTimer}
              className={`flex-1 max-w-xs py-4 rounded-2xl text-white font-black text-base md:text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${
                isRunning 
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30' 
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'Tạm Dừng' : 'Bắt Đầu'}
            </button>

            <button
              onClick={resetTimer}
              className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Đặt Lại
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: GROUP GENERATOR */}
      {activeSubTab === 'groups' && (
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Chia Nhóm Ngẫu Nhiên</h2>
              <p className="text-slate-500 text-sm mt-1">Xáo trộn danh sách lớp học để chia nhóm thảo luận</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Số HS / Nhóm:</label>
              <select
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
              >
                <option value={3}>3 học sinh</option>
                <option value={4}>4 học sinh</option>
                <option value={5}>5 học sinh</option>
                <option value={6}>6 học sinh</option>
              </select>
              <button
                onClick={handleGenerateGroups}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                Trộn Nhóm Ngay
              </button>
            </div>
          </div>

          {generatedGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedGroups.map((grp, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-black text-slate-800">Nhóm {idx + 1}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">{grp.length} thành viên</span>
                  </div>
                  <div className="space-y-1.5">
                    {grp.map(s => (
                      <div key={s.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-700">{s.avatar} {s.name}</span>
                        <span className="text-slate-400">Tổ {s.group}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Chưa chia nhóm. Nhấn "Trộn Nhóm Ngay" để bắt đầu!
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DICE ROLLER */}
      {activeSubTab === 'dice' && (
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-slate-150 text-center space-y-8 max-w-2xl mx-auto">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Xúc Xắc Thưởng Phạt</h2>
            <p className="text-slate-500 text-sm mt-1">Dùng để quay số ngẫu nhiên hoặc chọn học sinh trả lời câu hỏi</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-700">Số lượng xúc xắc:</span>
            {[1, 2, 3].map(cnt => (
              <button
                key={cnt}
                onClick={() => { setDiceCount(cnt); setDiceValues(Array.from({ length: cnt }, () => 1)); }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  diceCount === cnt ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {cnt} viên
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 py-8">
            {diceValues.map((val, idx) => (
              <div
                key={idx}
                className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex items-center justify-center text-4xl font-black shadow-2xl border-4 border-slate-800 transition-all ${
                  isRollingDice ? 'animate-spin' : ''
                }`}
              >
                {val}
              </div>
            ))}
          </div>

          <button
            onClick={rollDice}
            disabled={isRollingDice}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base shadow-xl transition-all"
          >
            {isRollingDice ? 'Đang tung...' : '🎲 Tung Xúc Xắc'}
          </button>
        </div>
      )}

      {/* TAB 4: TRAFFIC LIGHT */}
      {activeSubTab === 'traffic' && (
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-slate-150 text-center space-y-8 max-w-xl mx-auto">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Đèn Tín Hiệu Kỷ Luật</h2>
            <p className="text-slate-500 text-sm mt-1">Quy định mức độ âm thanh và kỷ luật khi thảo luận trong lớp</p>
          </div>

          <div className="w-36 mx-auto bg-slate-950 p-6 rounded-3xl shadow-2xl border-4 border-slate-800 space-y-6 flex flex-col items-center">
            {/* Red Light */}
            <div
              onClick={() => { sound.playClick(); setTrafficState('red'); }}
              className={`w-16 h-16 rounded-full cursor-pointer transition-all duration-300 border-4 border-slate-900 ${
                trafficState === 'red' ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] scale-110' : 'bg-red-950 opacity-40'
              }`}
            />
            {/* Yellow Light */}
            <div
              onClick={() => { sound.playClick(); setTrafficState('yellow'); }}
              className={`w-16 h-16 rounded-full cursor-pointer transition-all duration-300 border-4 border-slate-900 ${
                trafficState === 'yellow' ? 'bg-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.8)] scale-110' : 'bg-amber-950 opacity-40'
              }`}
            />
            {/* Green Light */}
            <div
              onClick={() => { sound.playClick(); setTrafficState('green'); }}
              className={`w-16 h-16 rounded-full cursor-pointer transition-all duration-300 border-4 border-slate-900 ${
                trafficState === 'green' ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8)] scale-110' : 'bg-emerald-950 opacity-40'
              }`}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-sm font-bold text-slate-800">
              {trafficState === 'red' && '🔴 Mức Đỏ: Giữ trật tự tuyệt đối, không nói chuyện riêng!'}
              {trafficState === 'yellow' && '🟡 Mức Vàng: Thảo luận nhóm nhỏ, nói thì thầm vừa đủ nghe.'}
              {trafficState === 'green' && '🟢 Mức Xanh: Được phép trao đổi thoải mái, hoạt động sôi nổi.'}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
