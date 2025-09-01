export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  isBlocked?: boolean;
  createdAt: Date;
}

export interface Strain {
  id: string;
  name: string;
  scientificName: string;
  type: string;
  description: string;
  source: string;
  preservationMethod: string;
  preservationTemperature: string;
  location: string;
  addedBy: string;
  addedAt: Date;
  updatedAt: Date;
  transferReminder?: {
    enabled: boolean;
    intervalDays: number;
    lastTransferDate?: Date;
    nextReminderDate?: Date;
  };
}

export interface Member {
  id: string;
  name: string;
  group: string;
  phone: string;
  grade?: string;
  class?: string;
  thesisContent?: string;
  otherInfo?: string;
  joinedAt: Date;
  updatedAt: Date;
}

export interface DutySchedule {
  id: string;
  date: string;
  members: string[];
  tasks: string[];
  status: 'pending' | 'completed' | 'skipped';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medium {
  id: string;
  name: string;
  type: 'liquid' | 'solid';
  suitableStrains: string[];
  formula: string;
  cultivationParams: {
    temperature: string;
    time: string;
    ph?: string;
    other?: string;
  };
  recommendedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Thesis {
  id: string;
  title: string;
  author: string;
  grade: string;
  class: string;
  otherContent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  module: string;
  details: string;
  timestamp: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, verificationCode?: string) => Promise<{ success: boolean; needsVerification?: boolean; message?: string }>;
  logout: () => void;
  sendVerificationCode: (email: string) => Promise<boolean>;
  completePendingRegistration: (verificationCode: string) => Promise<{ success: boolean; message: string }>;
  pendingRegistration: boolean;
}

export interface AppContextType {
  strains: Strain[];
  members: Member[];
  dutySchedules: DutySchedule[];
  media: Medium[];
  theses: Thesis[];
  activityLogs: ActivityLog[];
  addStrain: (strain: Omit<Strain, 'id' | 'addedAt' | 'updatedAt'>) => void;
  updateStrain: (id: string, strain: Partial<Strain>) => void;
  deleteStrain: (id: string) => void;
  addMember: (member: Omit<Member, 'id' | 'joinedAt' | 'updatedAt'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addDutySchedule: (schedule: Omit<DutySchedule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDutySchedule: (id: string, schedule: Partial<DutySchedule>) => void;
  deleteDutySchedule: (id: string) => void;
  addMedium: (medium: Omit<Medium, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMedium: (id: string, medium: Partial<Medium>) => void;
  deleteMedium: (id: string) => void;
  addThesis: (thesis: Omit<Thesis, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateThesis: (id: string, thesis: Partial<Thesis>) => void;
  deleteThesis: (id: string) => void;
  logActivity: (action: string, module: string, details: string) => void;
  exportData: (module: string) => void;
  importData: (module: string, file: File) => Promise<any[]>;
  downloadTemplate: (module: string) => void;
}