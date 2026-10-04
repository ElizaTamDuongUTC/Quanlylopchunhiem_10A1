import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Shield, Award, Users, CheckCircle, Lock, UserCheck, Volume2, VolumeX, Music } from 'lucide-react';
import { sound } from '../utils/sound';

interface LoginModalProps {
  onLogin: (user: User) => void;
}

const DEFAULT_BG_MUSIC = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf7f6.mp3?filename=gentle-piano-110649.mp3';

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('teacher');
  const [username, setUsername] = useState('giaovien');
  const [password, setPassword] = useState('Tam123456@@');
  const [fullName, setFullName] = useState('Cô Eliza Tâm Dương');
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return localStorage.getItem('smart_emulation_custom_logo') || '';
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [bgMusicUrl, setBgMusicUrl] = useState<string>(DEFAULT_BG_MUSIC);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-play on first user interaction to bypass browser autoplay policy
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Autoplay prevented or interrupted:', err);
        });
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isPlaying]);

  const togglePlayMusic = () => {
    sound.playClick();
    if (audioRef.current) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(err => {
            console.log('Play interrupted or failed:', err);
            setIsPlaying(false);
          });
        }
      }
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size <= 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng file nhạc vượt quá giới hạn 5MB. Vui lòng chọn file nhỏ hơn!');
      return;
    }

    // Check type (.mp3, .wav)
    if (!file.type.includes('audio') && !file.name.match(/\.(mp3|wav)$/i)) {
      alert('Chỉ chấp nhận file định dạng .mp3 hoặc .wav!');
      return;
    }

    try {
      const blobUrl = URL.createObjectURL(file);
      setBgMusicUrl(blobUrl);
      sound.playTing();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = blobUrl;
        audioRef.current.load();
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.log('Play interrupted:', err));
      }
      alert('Đã thay đổi nhạc nền thành công!');
    } catch (err) {
      console.error(err);
      alert('Không thể xử lý file nhạc này.');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoUrl(result);
        localStorage.setItem('smart_emulation_custom_logo', result);
        sound.playTing();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleChange = (selectedRole: UserRole) => {
    sound.playClick();
    setRole(selectedRole);
    if (selectedRole === 'teacher') {
      setUsername('giaovien');
      setFullName('Cô Eliza Tâm Dương');
      setPassword('Tam123456@@');
    } else if (selectedRole === 'monitor') {
      setUsername('lop trưởng');
      setFullName('Nguyễn Văn An (Lớp trưởng)');
      setPassword('10a1');
    } else if (selectedRole === 'red_flag') {
      setUsername('codu');
      setFullName('Vũ Thị Phương (Đội cờ đỏ)');
      setPassword('10a1');
    } else if (selectedRole === 'group_leader') {
      setUsername('totruong');
      setFullName('Trần Thị Bình (Tổ trưởng Tổ 1)');
      setPassword('10a1');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Simple demo auth check
    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }
    if (role === 'teacher' && password !== 'Tam123456@@') {
      sound.playBuzzer();
      setError('Mật khẩu không chính xác! Vui lòng nhập đúng mật khẩu GVCN: Tam123456@@');
      return;
    }
    sound.playTing();
    onLogin({
      username,
      role,
      fullName
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div 
          className="p-6 text-white text-center relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url('https://i.postimg.cc/Y9yTZNVB/43e11ffa-c730-416e-b0db-67addeb38ba1.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 pointer-events-none" />

          {/* HTML5 Audio element */}
          <audio 
            ref={audioRef} 
            src={bgMusicUrl} 
            loop 
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => {
              console.log('Audio source failed, falling back to default.');
              if (bgMusicUrl !== DEFAULT_BG_MUSIC) {
                setBgMusicUrl(DEFAULT_BG_MUSIC);
              }
            }}
          />

          {/* Music Control Widget */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-lg text-white">
            <button
              type="button"
              onClick={togglePlayMusic}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                isPlaying ? 'bg-red-600 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
              title={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
            >
              {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <label
              className="cursor-pointer p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-all flex items-center justify-center"
              title="Đổi nhạc nền (.mp3, .wav, tối đa 5MB)"
            >
              <Music className="w-4 h-4" />
              <input type="file" accept="audio/mp3, audio/wav, .mp3, .wav" onChange={handleAudioUpload} className="hidden" />
            </label>
          </div>

          <div className="relative z-10">
            <div className="relative group w-16 h-16 mx-auto mb-3">
              <label className="cursor-pointer block w-full h-full rounded-2xl bg-white/20 overflow-hidden flex items-center justify-center backdrop-blur-md border border-white/30 shadow-lg hover:border-yellow-300 transition-all">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Award className="w-8 h-8 text-yellow-300" />
                )}
                <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} className="hidden" />
              </label>
              <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                Đổi logo
              </div>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight drop-shadow-md">SỔ TAY THI ĐUA LỚP 10A1</h1>
            <p className="text-slate-200 text-xs mt-1 uppercase tracking-wider font-semibold drop-shadow-sm">Smart Emulation Handbook · THPT Xuân Giang</p>
            <div className="text-red-500 font-black text-xs mt-1.5 drop-shadow-md bg-white/90 px-3 py-0.5 rounded-full inline-block">GVCN: Cô Eliza Tâm Dương</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Chọn vai trò truy cập
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange('teacher')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  role === 'teacher'
                    ? 'border-red-600 bg-red-50/50 text-red-900 ring-2 ring-red-600/20 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Shield className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Giáo viên chủ nhiệm</div>
                  <div className="text-[10px] text-slate-500">Toàn quyền hệ thống</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('monitor')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  role === 'monitor'
                    ? 'border-red-600 bg-red-50/50 text-red-900 ring-2 ring-red-600/20 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <UserCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Lớp trưởng</div>
                  <div className="text-[10px] text-slate-500">Chấm điểm & Báo cáo</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('red_flag')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  role === 'red_flag'
                    ? 'border-red-600 bg-red-50/50 text-red-900 ring-2 ring-red-600/20 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Award className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Đội cờ đỏ</div>
                  <div className="text-[10px] text-slate-500">Chấm nề nếp</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('group_leader')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  role === 'group_leader'
                    ? 'border-red-600 bg-red-50/50 text-red-900 ring-2 ring-red-600/20 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Users className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Tổ trưởng</div>
                  <div className="text-[10px] text-slate-500">Xem điểm tổ</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Họ và tên người dùng
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Mật khẩu truy cập
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                placeholder="Nhập mật khẩu..."
                required
              />
            </div>
          </div>

          {error && <div className="text-xs text-red-600 font-medium">{error}</div>}

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            VÀO HỆ THỐNG
          </button>
        </form>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          Hệ thống quản lý điểm thi đua kết nối Google Sheets 100%
        </div>
      </div>
    </div>
  );
};
