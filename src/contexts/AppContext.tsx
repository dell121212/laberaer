import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { exportToExcel, importFromExcel, downloadTemplate as downloadExcelTemplate } from '../utils/excelUtils';
import { 
  Strain, 
  Member, 
  DutySchedule, 
  Medium, 
  Thesis, 
  ActivityLog, 
  AppContextType 
} from '../types';

// 全局数据存储键
const GLOBAL_DATA_KEYS = {
  strains: 'global_strains',
  members: 'global_members',
  dutySchedules: 'global_dutySchedules',
  media: 'global_media',
  theses: 'global_theses',
  activityLogs: 'global_activityLogs'
};
const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // State management
  const [strains, setStrains] = useState<Strain[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [dutySchedules, setDutySchedules] = useState<DutySchedule[]>([]);
  const [media, setMedia] = useState<Medium[]>([]);
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedStrains = localStorage.getItem(GLOBAL_DATA_KEYS.strains);
        const savedMembers = localStorage.getItem(GLOBAL_DATA_KEYS.members);
        const savedDutySchedules = localStorage.getItem(GLOBAL_DATA_KEYS.dutySchedules);
        const savedMedia = localStorage.getItem(GLOBAL_DATA_KEYS.media);
        const savedTheses = localStorage.getItem(GLOBAL_DATA_KEYS.theses);
        const savedActivityLogs = localStorage.getItem(GLOBAL_DATA_KEYS.activityLogs);

        if (savedStrains) {
          const parsedStrains = JSON.parse(savedStrains);
          setStrains(parsedStrains.map((strain: any) => ({
            ...strain,
            addedAt: new Date(strain.addedAt),
            updatedAt: new Date(strain.updatedAt)
          })));
        }
        if (savedMembers) {
          const parsedMembers = JSON.parse(savedMembers);
          setMembers(parsedMembers.map((member: any) => ({
            ...member,
            joinedAt: new Date(member.joinedAt),
            updatedAt: new Date(member.updatedAt)
          })));
        }
        if (savedDutySchedules) {
          const parsedSchedules = JSON.parse(savedDutySchedules);
          setDutySchedules(parsedSchedules.map((schedule: any) => ({
            ...schedule,
            createdAt: new Date(schedule.createdAt),
            updatedAt: new Date(schedule.updatedAt)
          })));
        }
        if (savedMedia) {
          const parsedMedia = JSON.parse(savedMedia);
          setMedia(parsedMedia.map((medium: any) => ({
            ...medium,
            createdAt: new Date(medium.createdAt),
            updatedAt: new Date(medium.updatedAt)
          })));
        }
        if (savedTheses) {
          const parsedTheses = JSON.parse(savedTheses);
          setTheses(parsedTheses.map((thesis: any) => ({
            ...thesis,
            createdAt: new Date(thesis.createdAt),
            updatedAt: new Date(thesis.updatedAt)
          })));
        }
        if (savedActivityLogs) {
          const parsedLogs = JSON.parse(savedActivityLogs);
          setActivityLogs(parsedLogs.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp)
          })));
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(GLOBAL_DATA_KEYS.strains, JSON.stringify(strains));
  }, [strains]);

  useEffect(() => {
    localStorage.setItem(GLOBAL_DATA_KEYS.members, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(GLOBAL_DATA_KEYS.dutySchedules, JSON.stringify(dutySchedules));
  }, [dutySchedules]);

  useEffect(() => {
    localStorage.setItem(GLOBAL_DATA_KEYS.media, JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem(GLOBAL_DATA_KEYS.theses, JSON.stringify(theses));
  }, [theses]);

  useEffect(() => {
    localStorage.setItem(GLOBAL_DATA_KEYS.activityLogs, JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Helper function to add activity log
  const logActivity = (action: string, module: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      userId: user?.id || 'unknown',
      username: user?.username || 'Unknown User',
      action,
      module,
      details,
      timestamp: new Date()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Strain operations
  const addStrain = (strain: Omit<Strain, 'id'>) => {
    const newStrain: Strain = {
      ...strain,
      id: Date.now().toString(),
      addedAt: new Date(),
      updatedAt: new Date()
    };
    setStrains(prev => [...prev, newStrain]);
    logActivity('添加', '菌种保藏', `添加菌种: ${strain.name}`);
  };

  const updateStrain = (id: string, strain: Partial<Strain>) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以编辑菌种信息');
      return;
    }
    setStrains(prev => prev.map(s => s.id === id ? { ...s, ...strain, updatedAt: new Date() } : s));
    logActivity('编辑', '菌种保藏', `编辑菌种: ${strain.name || id}`);
  };

  const deleteStrain = (id: string) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以删除菌种');
      return;
    }
    const strain = strains.find(s => s.id === id);
    setStrains(prev => prev.filter(s => s.id !== id));
    logActivity('删除', '菌种保藏', `删除菌种: ${strain?.name || id}`);
  };

  // Member operations
  const addMember = (member: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
      joinedAt: new Date(),
      updatedAt: new Date()
    };
    setMembers(prev => [...prev, newMember]);
    logActivity('添加', '成员名单', `添加成员: ${member.name}`);
  };

  const updateMember = (id: string, member: Partial<Member>) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以编辑成员信息');
      return;
    }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...member, updatedAt: new Date() } : m));
    logActivity('编辑', '成员名单', `编辑成员: ${member.name || id}`);
  };

  const deleteMember = (id: string) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以删除成员');
      return;
    }
    const member = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    logActivity('删除', '成员名单', `删除成员: ${member?.name || id}`);
  };

  // Duty schedule operations
  const addDutySchedule = (schedule: Omit<DutySchedule, 'id'>) => {
    const newSchedule: DutySchedule = {
      ...schedule,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setDutySchedules(prev => [...prev, newSchedule]);
    logActivity('添加', '卫生值日', `添加值日安排: ${schedule.date}`);
  };

  const updateDutySchedule = (id: string, schedule: Partial<DutySchedule>) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以编辑值日安排');
      return;
    }
    setDutySchedules(prev => prev.map(d => d.id === id ? { ...d, ...schedule, updatedAt: new Date() } : d));
    logActivity('编辑', '卫生值日', `编辑值日安排: ${schedule.date || id}`);
  };

  const deleteDutySchedule = (id: string) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以删除值日安排');
      return;
    }
    const schedule = dutySchedules.find(d => d.id === id);
    setDutySchedules(prev => prev.filter(d => d.id !== id));
    logActivity('删除', '卫生值日', `删除值日安排: ${schedule?.date || id}`);
  };

  // Medium operations
  const addMedium = (medium: Omit<Medium, 'id'>) => {
    const newMedium: Medium = {
      ...medium,
      id: Date.now().toString(),
      type: medium.type || 'solid',
      cultivationParams: medium.cultivationParams || {
        temperature: '',
        time: '',
        ph: '',
        other: ''
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setMedia(prev => [...prev, newMedium]);
    logActivity('添加', '培养基推荐', `添加培养基: ${medium.name}`);
  };

  const updateMedium = (id: string, medium: Partial<Medium>) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以编辑培养基信息');
      return;
    }
    setMedia(prev => prev.map(m => m.id === id ? { ...m, ...medium, updatedAt: new Date() } : m));
    logActivity('编辑', '培养基推荐', `编辑培养基: ${medium.name || id}`);
  };

  const deleteMedium = (id: string) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以删除培养基');
      return;
    }
    const medium = media.find(m => m.id === id);
    setMedia(prev => prev.filter(m => m.id !== id));
    logActivity('删除', '培养基推荐', `删除培养基: ${medium?.name || id}`);
  };

  // Thesis operations
  const addThesis = (thesis: Omit<Thesis, 'id'>) => {
    const newThesis: Thesis = {
      ...thesis,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTheses(prev => [...prev, newThesis]);
    logActivity('添加', '历届毕业论文', `添加论文: ${thesis.title}`);
  };

  const updateThesis = (id: string, thesis: Partial<Thesis>) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以编辑论文信息');
      return;
    }
    setTheses(prev => prev.map(t => t.id === id ? { ...t, ...thesis, updatedAt: new Date() } : t));
    logActivity('编辑', '历届毕业论文', `编辑论文: ${thesis.title || id}`);
  };

  const deleteThesis = (id: string) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以删除论文');
      return;
    }
    const thesis = theses.find(t => t.id === id);
    setTheses(prev => prev.filter(t => t.id !== id));
    logActivity('删除', '历届毕业论文', `删除论文: ${thesis?.title || id}`);
  };

  // Export functions
  const exportData = (module: string) => {
    let data: any[] = [];
    let filename = '';
    
    switch (module) {
      case 'strains':
        data = strains.map(strain => ({
          菌种名称: strain.name,
          学名: strain.scientificName,
          类型: strain.type,
          来源: strain.source,
          保藏方法: strain.preservationMethod,
          保藏温度: strain.preservationTemperature,
          保藏位置: strain.location,
          描述: strain.description,
          添加人: strain.addedBy,
          添加时间: new Date(strain.addedAt).toLocaleString()
        }));
        filename = '菌种保藏数据';
        break;
      case 'members':
        data = members.map(member => ({
          姓名: member.name,
          组别: member.group,
          电话: member.phone,
          年级: member.grade || '',
          班级: member.class || '',
          毕设内容: member.thesisContent || '',
          其他信息: member.otherInfo || '',
          加入时间: new Date(member.joinedAt).toLocaleString()
        }));
        filename = '成员名单数据';
        break;
      case 'media':
        data = media.map(medium => ({
          培养基名称: medium.name,
          适用菌种: medium.suitableStrains.join(','),
          配方: medium.formula,
          推荐人: medium.recommendedBy,
          创建时间: new Date(medium.createdAt).toLocaleString()
        }));
        filename = '培养基推荐数据';
        break;
      case 'theses':
        data = theses.map(thesis => ({
          论文题目: thesis.title,
          作者: thesis.author,
          年级: thesis.grade,
          班级: thesis.class,
          其他内容: thesis.otherContent,
          创建时间: new Date(thesis.createdAt).toLocaleString()
        }));
        filename = '毕业论文数据';
        break;
    }
    
    if (exportToExcel(data, filename)) {
      logActivity('导出', filename, `导出${data.length}条数据到Excel`);
    }
  };

  // Import functions
  const importData = async (module: string, file: File) => {
    try {
      const data = await importFromExcel(file);
      
      switch (module) {
        case 'strains':
          const newStrains = data.map((item: any) => ({
            id: Date.now().toString() + Math.random(),
            name: item['菌种名称'] || item.name || '',
            scientificName: item['学名'] || item.scientificName || '',
            type: item['类型'] || item.type || '真菌',
            source: item['来源'] || item.source || '',
            preservationMethod: item['保藏方法'] || item.preservationMethod || '',
            preservationTemperature: item['保藏温度'] || item.preservationTemperature || '',
            location: item['保藏位置'] || item.location || '',
            description: item['描述'] || item.description || '',
            addedBy: item['添加人'] || item.addedBy || '导入用户',
            addedAt: new Date(),
            updatedAt: new Date()
          }));
          setStrains(prev => [...prev, ...newStrains]);
          break;
        case 'members':
          const newMembers = data.map((item: any) => ({
            id: Date.now().toString() + Math.random(),
            name: item['姓名'] || item.name || '',
            group: item['组别'] || item.group || '',
            phone: item['电话'] || item.phone || '',
            grade: item['年级'] || item.grade || '',
            class: item['班级'] || item.class || '',
            thesisContent: item['毕设内容'] || item.thesisContent || '',
            otherInfo: item['其他信息'] || item.otherInfo || '',
            joinedAt: new Date(),
            updatedAt: new Date()
          }));
          setMembers(prev => [...prev, ...newMembers]);
          break;
        case 'media':
          const newMedia = data.map((item: any) => ({
            id: Date.now().toString() + Math.random(),
            name: item['培养基名称'] || item.name || '',
            type: (item['类型'] === '液体发酵' ? 'liquid' : 'solid') || item.type || 'solid',
            suitableStrains: (item['适用菌种'] || item.suitableStrains || '').split(',').filter((s: string) => s.trim()),
            formula: item['配方'] || item.formula || '',
            cultivationParams: {
              temperature: item['培养温度'] || item.cultivationParams?.temperature || '',
              time: item['培养时间'] || item.cultivationParams?.time || '',
              ph: item['pH值'] || item.cultivationParams?.ph || '',
              other: item['其他参数'] || item.cultivationParams?.other || ''
            },
            recommendedBy: item['推荐人'] || item.recommendedBy || '导入用户',
            createdAt: new Date(),
            updatedAt: new Date()
          }));
          setMedia(prev => [...prev, ...newMedia]);
          break;
        case 'theses':
          const newTheses = data.map((item: any) => ({
            id: Date.now().toString() + Math.random(),
            title: item['论文题目'] || item.title || '',
            author: item['作者'] || item.author || '',
            grade: item['年级'] || item.grade || '',
            class: item['班级'] || item.class || '',
            otherContent: item['其他内容'] || item.otherContent || '',
            createdAt: new Date(),
            updatedAt: new Date()
          }));
          setTheses(prev => [...prev, ...newTheses]);
          break;
      }
      
      logActivity('导入', module, `从Excel导入${data.length}条数据`);
      return data;
    } catch (error) {
      console.error('导入失败:', error);
      throw error;
    }
  };

  const downloadTemplate = (module: string) => {
    downloadExcelTemplate(module);
    logActivity('下载', '模板', `下载${module}导入模板`);
  };

  const value: AppContextType = {
    // State
    strains,
    members,
    dutySchedules,
    media,
    theses,
    activityLogs,
    
    // Strain operations
    addStrain,
    updateStrain,
    deleteStrain,
    
    // Member operations
    addMember,
    updateMember,
    deleteMember,
    
    // Duty schedule operations
    addDutySchedule,
    updateDutySchedule,
    deleteDutySchedule,
    
    // Medium operations
    addMedium,
    updateMedium,
    deleteMedium,
    
    // Thesis operations
    addThesis,
    updateThesis,
    deleteThesis,
    
    // Import/Export operations
    exportData,
    importData,
    downloadTemplate,
    logActivity
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};