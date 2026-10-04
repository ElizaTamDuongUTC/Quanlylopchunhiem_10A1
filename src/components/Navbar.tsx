import React from 'react';
import { Menu, Search, RefreshCw, LogOut, Shield, UserCheck, Users, Award } from 'lucide-react';
import { User } from '../types';
import { sound } from '../utils/sound';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onOpenMobileSidebar: () => void;
  onSyncGas: () => void;
  isSyncing: boolean;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  currentWeek: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onOpenMobileSidebar,
  onSyncGas,
  isSyncing,
  globalSearch,
  setGlobalSearch,
  currentWeek
}) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'teacher':
        return <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-md font-semibold"><Shield className="w-3.5 h-3.5" /> GVCN</span>;
      case 'monitor':
        return <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md font-semibold"><UserCheck className="w-3.5 h-3.5" /> Lớp trưởng</span>;
      case 'red_flag':
        return <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md font-semibold"><Award className="w-3.5 h-3.5" /> Cờ đỏ</span>;
      default:
        return <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-semibold"><Users className="w-3.5 h-3.5" /> Tổ trưởng</span>;
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Zone 1: Mobile Hamburger + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            sound.playClick();
            onOpenMobileSidebar();
          }}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Mở menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">SỔ TAY THI ĐUA LỚP 10A1</h1>
          <p className="text-xs text-slate-500 font-medium">THPT Xuân Giang · Tuần {currentWeek} · Học kỳ I (2026 - 2027)</p>
        </div>
      </div>

      {/* Zone 2: Global Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Tìm kiếm học sinh nhanh (Gõ tên để cộng/trừ điểm)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all"
          />
        </div>
      </div>

      {/* Zone 3: User Info, Sync GAS & Logout */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onSyncGas();
          }}
          disabled={isSyncing}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
          title="Đồng bộ Google Sheets API"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-red-600' : ''}`} />
          <span className="hidden lg:inline">Đồng bộ Sheets</span>
        </button>

        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">{user.fullName}</div>
            <div className="text-[10px] text-slate-500">{user.username}</div>
          </div>
          {getRoleBadge(user.role)}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onLogout();
          }}
          className="p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
