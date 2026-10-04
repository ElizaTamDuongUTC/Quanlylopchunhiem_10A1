import React, { useState } from 'react';
import { Settings as SettingsIcon, Database, Copy, Check, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { GAS_CODE_TEMPLATE, sheetsService } from '../services/sheetsService';
import { sound } from '../utils/sound';

interface SettingsModalProps {
  onClose: () => void;
  onRefreshData: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onRefreshData, showToast }) => {
  const [gasUrl, setGasUrl] = useState(sheetsService.getGasUrl());
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    sheetsService.setGasUrl(gasUrl);
    showToast('Đã lưu cấu hình Google Apps Script thành công!', 'success');
    onClose();
  };

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(GAS_CODE_TEMPLATE);
    setCopied(true);
    showToast('Đã sao chép mã Google Apps Script vào Clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTestConnection = async () => {
    sound.playClick();
    setIsTesting(true);
    sheetsService.setGasUrl(gasUrl);
    const result = await sheetsService.fetchFromGas();
    setIsTesting(false);
    if (result.success) {
      showToast(result.message, 'success');
      onRefreshData();
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cài đặt & Đồng bộ Google Sheets</h2>
              <p className="text-xs text-slate-500">Cấu hình kết nối API Google Apps Script & Cơ sở dữ liệu lớp 10A1 - THPT Xuân Giang</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* GAS URL Input */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-red-600" />
                Google Apps Script Web App URL
              </label>
              <input
                type="url"
                value={gasUrl}
                onChange={(e) => setGasUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Dán URL Web App sau khi triển khai (Deploy) mã nguồn Google Apps Script bên dưới. Nếu để trống, hệ thống sẽ tự động dùng LocalStorage làm bộ nhớ tạm trên máy.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Lưu cấu hình
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !gasUrl}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isTesting ? <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /> : null}
                Kiểm tra & Đồng bộ ngay
              </button>
            </div>
          </form>

          {/* Apps Script Code Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Mã nguồn Google Apps Script (.gs)
                </h3>
                <p className="text-xs text-slate-500">Copy đoạn mã này dán vào Google Apps Script của file Google Sheets <code className="text-slate-800 font-semibold">DU_LIEU_THI_DUA_10A1</code></p>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Đã sao chép' : 'Sao chép mã'}
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
                {GAS_CODE_TEMPLATE}
              </pre>
            </div>
          </div>

          {/* Database structure info */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <div className="font-bold">Cấu trúc 4 Sheet bắt buộc trong Google Sheets:</div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><code className="font-semibold">DANH_SACH_HOC_SINH</code> (MaHS, HoTen, To, TongDiem, Role, Avatar, WeeklyChange)</li>
                <li><code className="font-semibold">DANH_MUC_THI_DUA</code> (MaTieuChi, TenTieuChi, Loai, Diem)</li>
                <li><code className="font-semibold">LICH_SU_CHAM_DIEM</code> (ID, ThoiGian, NguoiCham, MaHS, MaTieuChi, DiemThayDoi, Type)</li>
                <li><code className="font-semibold">CAU_HINH</code> (Key, Value)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
