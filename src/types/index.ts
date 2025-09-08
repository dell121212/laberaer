export interface User {
  id: string;
  username: string;
  email: string;
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
    ph: string;
    other: string;
    storage_temperature?: string;
    storage_time?: string;
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

export interface AppContextType {
  // State
  strains: Strain[];
  members: Member[];
  dutySchedules: DutySchedule[];
  media: Medium[];
  theses: Thesis[];
  activityLogs: ActivityLog[];
  
  // Strain operations
  addStrain: (strain: Omit<Strain, 'id' | 'addedAt' | 'updatedAt'>) => Promise<void>;
  updateStrain: (id: string, strain: Partial<Strain>) => Promise<void>;
  deleteStrain: (id: string) => Promise<void>;
  
  // Member operations
  addMember: (member: Omit<Member, 'id' | 'joinedAt' | 'updatedAt'>) => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  
  // Duty schedule operations
  addDutySchedule: (schedule: Omit<DutySchedule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDutySchedule: (id: string, schedule: Partial<DutySchedule>) => Promise<void>;
  deleteDutySchedule: (id: string) => Promise<void>;
  
  // Medium operations
  addMedium: (medium: Omit<Medium, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMedium: (id: string, medium: Partial<Medium>) => Promise<void>;
  deleteMedium: (id: string) => Promise<void>;
  
  // Thesis operations
  addThesis: (thesis: Omit<Thesis, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateThesis: (id: string, thesis: Partial<Thesis>) => Promise<void>;
  deleteThesis: (id: string) => Promise<void>;
  
  // Import/Export operations
  exportData: (module: string) => void;
  importData: (module: string, file: File) => Promise<any[]>;
  downloadTemplate: (module: string) => void;
  logActivity: (action: string, module: string, details: string) => Promise<void>;
}