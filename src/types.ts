export type UserRole = 'teacher' | 'monitor' | 'red_flag' | 'group_leader';

export interface User {
  username: string;
  role: UserRole;
  fullName: string;
}

export interface Student {
  id: string;
  name: string;
  group: number; // 1, 2, 3, 4
  score: number;
  role?: string; // Lớp trưởng, Tổ trưởng, etc.
  avatar?: string;
  weeklyChange?: number;
}

export interface Criteria {
  id: string;
  name: string;
  type: 'bonus' | 'penalty';
  points: number;
}

export interface EmulationLog {
  id: string;
  time: string;
  scorer: string;
  studentId: string;
  studentName: string;
  criteriaId: string;
  criteriaName: string;
  pointsChange: number;
  type: 'bonus' | 'penalty';
  isReverted?: boolean;
}

export interface GroupInfo {
  id: number;
  name: string;
  score: number;
  memberCount: number;
  avgScore: number;
}
