/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Student, Criteria, EmulationLog } from './types';
import { sheetsService } from './services/sheetsService';
import { LoginModal } from './components/LoginModal';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Toast, ToastMessage } from './components/Toast';
import { SettingsModal } from './components/SettingsModal';
import { Dashboard } from './pages/Dashboard';
import { Leaderboard } from './pages/Leaderboard';
import { QuickScoring } from './pages/QuickScoring';
import { GroupEmulation } from './pages/GroupEmulation';
import { StudentManagement } from './pages/StudentManagement';
import { StudentProfileModal } from './pages/StudentProfileModal';
import { CriteriaManagement } from './pages/CriteriaManagement';
import { HomeroomReport } from './pages/HomeroomReport';
import { AuditLogs } from './pages/AuditLogs';
import { RandomPicker } from './pages/RandomPicker';
import { ClassroomUtilities } from './pages/ClassroomUtilities';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<Student | null>(null);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [logs, setLogs] = useState<EmulationLog[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(6);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Initial load
  useEffect(() => {
    setStudents(sheetsService.getStudents());
    setCriteria(sheetsService.getCriteria());
    setLogs(sheetsService.getLogs());
    setCurrentWeek(sheetsService.getCurrentWeek());
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Handlers for updating data
  const handleUpdateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    sheetsService.saveStudents(newStudents);
  };

  const handleUpdateCriteria = (newCriteria: Criteria[]) => {
    setCriteria(newCriteria);
    sheetsService.saveCriteria(newCriteria);
  };

  const handleUpdateLogs = (newLogs: EmulationLog[]) => {
    setLogs(newLogs);
    sheetsService.saveLogs(newLogs);
  };

  const handleUpdateCurrentWeek = (week: number) => {
    setCurrentWeek(week);
    sheetsService.setCurrentWeek(week);
  };

  const handleSyncGas = async () => {
    setIsSyncing(true);
    const result = await sheetsService.fetchFromGas();
    setIsSyncing(false);
    if (result.success) {
      showToast(result.message, 'success');
      setStudents(sheetsService.getStudents());
      setCriteria(sheetsService.getCriteria());
      setLogs(sheetsService.getLogs());
    } else {
      showToast(result.message, 'info');
      // Open settings if no URL configured
      if (!sheetsService.getGasUrl()) {
        setIsSettingsOpen(true);
      }
    }
  };

  // If not logged in, show Login Modal
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans antialiased flex items-center justify-center p-4">
        <LoginModal onLogin={(loggedInUser) => {
          setUser(loggedInUser);
          showToast(`Đăng nhập thành công với vai trò: ${loggedInUser.fullName}`, 'success');
        }} />
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'settings') {
            setIsSettingsOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        userRole={user.role}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen">
        <Navbar
          user={user}
          onLogout={() => setUser(null)}
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          onSyncGas={handleSyncGas}
          isSyncing={isSyncing}
          globalSearch={globalSearch}
          setGlobalSearch={(q) => {
            setGlobalSearch(q);
            if (q.trim()) {
              const found = students.find(s => s.name.toLowerCase().includes(q.toLowerCase()));
              if (found) {
                setSelectedStudentProfile(found);
              }
            }
          }}
          currentWeek={currentWeek}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              students={students}
              logs={logs}
              currentWeek={currentWeek}
              onNavigateTab={setActiveTab}
              onSelectStudent={setSelectedStudentProfile}
            />
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard
              students={students}
              onSelectStudent={setSelectedStudentProfile}
            />
          )}

          {activeTab === 'scoring' && (
            <QuickScoring
              students={students}
              criteria={criteria}
              logs={logs}
              user={user}
              onUpdateStudents={handleUpdateStudents}
              onUpdateLogs={handleUpdateLogs}
              showToast={showToast}
            />
          )}

          {activeTab === 'utilities' && (
            <ClassroomUtilities
              students={students}
              currentWeek={currentWeek}
            />
          )}

          {activeTab === 'random_picker' && (
            <RandomPicker
              students={students}
              currentWeek={currentWeek}
            />
          )}

          {activeTab === 'groups' && (
            <GroupEmulation
              students={students}
              onSelectStudent={setSelectedStudentProfile}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagement
              students={students}
              onUpdateStudents={handleUpdateStudents}
              onSelectStudent={setSelectedStudentProfile}
              showToast={showToast}
              userRole={user.role}
            />
          )}

          {activeTab === 'criteria' && user.role === 'teacher' && (
            <CriteriaManagement
              criteria={criteria}
              onUpdateCriteria={handleUpdateCriteria}
              showToast={showToast}
            />
          )}

          {activeTab === 'report' && (
            <HomeroomReport
              students={students}
              logs={logs}
              currentWeek={currentWeek}
              onUpdateCurrentWeek={handleUpdateCurrentWeek}
              showToast={showToast}
            />
          )}

          {activeTab === 'logs' && (
            <AuditLogs
              logs={logs}
              students={students}
              onUpdateLogs={handleUpdateLogs}
              onUpdateStudents={handleUpdateStudents}
              showToast={showToast}
              userRole={user.role}
            />
          )}
        </main>
      </div>

      {/* Student Profile Modal */}
      {selectedStudentProfile && (
        <StudentProfileModal
          student={selectedStudentProfile}
          logs={logs}
          onClose={() => setSelectedStudentProfile(null)}
          onUpdateStudent={(updated) => {
            const updatedList = students.map(s => s.id === updated.id ? updated : s);
            handleUpdateStudents(updatedList);
            setSelectedStudentProfile(updated);
          }}
          showToast={showToast}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onRefreshData={handleSyncGas}
          showToast={showToast}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
