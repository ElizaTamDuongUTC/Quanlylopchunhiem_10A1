import React from 'react';
import { 
  LayoutDashboard, 
  Trophy, 
  Zap, 
  Users, 
  GraduationCap, 
  ListTree, 
  BarChart3, 
  History, 
  Settings,
  X,
  Award,
  Dices,
  Wrench
} from 'lucide-react';
import { sound } from '../utils/sound';

export type ActiveTab = 
  | 'dashboard' 
  | 'leaderboard' 
  | 'scoring' 
  | 'groups' 
  | 'students' 
  | 'criteria' 
  | 'report' 
  | 'logs' 
  | 'random_picker'
  | 'utilities'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  userRole
}) => {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'leaderboard' as ActiveTab, label: 'Bảng Xếp Hạng', icon: Trophy },
    { id: 'scoring' as ActiveTab, label: 'Chấm Điểm Nhanh', icon: Zap, highlight: true },
    { id: 'random_picker' as ActiveTab, label: 'Vòng Quay & Gọi Tên', icon: Dices },
    { id: 'utilities' as ActiveTab, label: 'Tiện Ích Lớp Học', icon: Wrench },
    { id: 'groups' as ActiveTab, label: 'Thi đua các Tổ', icon: Users },
    { id: 'students' as ActiveTab, label: 'Danh sách Học sinh', icon: GraduationCap },
    { id: 'criteria' as ActiveTab, label: 'Tiêu chí Thi đua', icon: ListTree, teacherOnly: true },
    { id: 'report' as ActiveTab, label: 'Báo cáo Sinh hoạt', icon: BarChart3 },
    { id: 'logs' as ActiveTab, label: 'Lịch sử Chấm điểm', icon: History },
    { id: 'settings' as ActiveTab, label: 'Cài đặt & GAS', icon: Settings, teacherOnly: true },
  ];

  const handleNavClick = (id: ActiveTab) => {
    sound.playClick();
    setActiveTab(id);
    setIsOpenMobile(false);
  };

  const filteredItems = menuItems.filter(item => {
    if (item.teacherOnly && userRole !== 'teacher') return false;
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Award className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="text-white font-extrabold tracking-tight text-base leading-tight">LỚP 10A1</div>
              <div className="text-[11px] text-red-400 font-medium tracking-wide">THPT Xuân Giang</div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpenMobile(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Hệ thống Quản lý
          </div>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-red-600 text-white font-semibold shadow-lg shadow-red-600/25'
                    : item.highlight
                    ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-rose-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 text-xs text-slate-500">
          <div className="font-semibold text-slate-400">Phiên bản v1.0</div>
          <div>Đồng bộ Google Sheets API</div>
        </div>
      </aside>
    </>
  );
};
