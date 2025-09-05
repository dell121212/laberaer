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

  // Load data from localStorage
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
          tasks: item.tasks,
          status: item.status as 'pending' | 'completed' | 'skipped',
          notes: item.notes,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at)
        })));
      }

      // 加载培养基数据
      const { data: mediaData } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (mediaData) {
        setMedia(mediaData.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type as 'liquid' | 'solid',
          suitableStrains: item.suitable_strains,
          formula: item.formula,
          cultivationParams: item.cultivation_params,
          recommendedBy: item.recommended_by,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at)
        })));
      }

      // 加载论文数据
      const { data: thesesData } = await supabase
        .from('theses')
        .select('*')
        .order('created_at', { ascending: false });

      if (thesesData) {
        setTheses(thesesData.map(item => ({
          id: item.id,
          title: item.title,
          author: item.author,
          grade: item.grade,
          class: item.class,
          otherContent: item.other_content,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at)
        })));
      }

      // 加载操作记录数据
      const { data: logsData } = await supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (logsData) {
        setActivityLogs(logsData.map(item => ({
          id: item.id,
          userId: item.user_id,
          username: item.username,
          action: item.action,
          module: item.module,
          details: item.details,
          timestamp: new Date(item.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Helper function to add activity log
  const logActivity = async (action: string, module: string, details: string) => {
    if (!user) return;

    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
    <div className="min-h-screen pb-20 safe-area-padding relative overflow-hidden">
      {/* 粒子背景效果 */}
      <div className="particles-bg">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      username: user.username,
      action,
      module,
      details,
      timestamp: new Date()
    };

    try {
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          username: user.username,
          action,
          module,
          details
        });

      setActivityLogs(prev => [newLog, ...prev]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Strain operations
  const addStrain = async (strain: Omit<Strain, 'id' | 'addedAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('strains')
        .insert({
          name: strain.name,
          scientific_name: strain.scientificName,
          type: strain.type,
          description: strain.description,
          source: strain.source,
          preservation_method: strain.preservationMethod,
          preservation_temperature: strain.preservationTemperature,
          location: strain.location,
          added_by: strain.addedBy
        })
        .select()
        .single();

      if (error) throw error;

      const newStrain: Strain = {
        id: data.id,
        name: data.name,
        scientificName: data.scientific_name,
        type: data.type,
        description: data.description,
        source: data.source,
        preservationMethod: data.preservation_method,
        preservationTemperature: data.preservation_temperature,
        location: data.location,
        addedBy: data.added_by,
        addedAt: new Date(data.added_at),
        updatedAt: new Date(data.updated_at)
      };

      setStrains(prev => [newStrain, ...prev]);
      logActivity('添加', '菌种保藏', `添加菌种: ${strain.name}`);
    } catch (error) {
      console.error('Error adding strain:', error);
      alert('添加菌种失败，请重试');
    }
  };

  const updateStrain = async (id: string, strain: Partial<Strain>) => {
    try {
      const updateData: any = {};
      if (strain.name) updateData.name = strain.name;
      if (strain.scientificName) updateData.scientific_name = strain.scientificName;
      if (strain.type) updateData.type = strain.type;
      if (strain.description !== undefined) updateData.description = strain.description;
      if (strain.source) updateData.source = strain.source;
      if (strain.preservationMethod) updateData.preservation_method = strain.preservationMethod;
      if (strain.preservationTemperature) updateData.preservation_temperature = strain.preservationTemperature;
      if (strain.location) updateData.location = strain.location;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('strains')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setStrains(prev => prev.map(s => s.id === id ? { ...s, ...strain, updatedAt: new Date() } : s));
      logActivity('编辑', '菌种保藏', `编辑菌种: ${strain.name || id}`);
    } catch (error) {
      console.error('Error updating strain:', error);
      alert('更新菌种失败，请重试');
    }
  };

  const deleteStrain = async (id: string) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以删除菌种');
      return;
    }

    try {
      const strain = strains.find(s => s.id === id);
      
      const { error } = await supabase
        .from('strains')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStrains(prev => prev.filter(s => s.id !== id));
      logActivity('删除', '菌种保藏', `删除菌种: ${strain?.name || id}`);
    } catch (error) {
      console.error('Error deleting strain:', error);
      alert('删除菌种失败，请重试');
    }
  };

  // Member operations
  const addMember = async (member: Omit<Member, 'id' | 'joinedAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert({
          name: member.name,
          group: member.group,
          phone: member.phone,
          grade: member.grade,
          class: member.class,
          thesis_content: member.thesisContent,
          other_info: member.otherInfo
        })
        .select()
        .single();

      if (error) throw error;

      const newMember: Member = {
        id: data.id,
        name: data.name,
        group: data.group,
        phone: data.phone,
        grade: data.grade,
        class: data.class,
        thesisContent: data.thesis_content,
        otherInfo: data.other_info,
        joinedAt: new Date(data.joined_at),
        updatedAt: new Date(data.updated_at)
      };

      setMembers(prev => [newMember, ...prev]);
      logActivity('添加', '成员名单', `添加成员: ${member.name}`);
    } catch (error) {
      console.error('Error adding member:', error);
      alert('添加成员失败，请重试');
    }
  };

  const updateMember = async (id: string, member: Partial<Member>) => {
    try {
      const updateData: any = {};
      if (member.name) updateData.name = member.name;
      if (member.group) updateData.group = member.group;
      if (member.phone) updateData.phone = member.phone;
      if (member.grade !== undefined) updateData.grade = member.grade;
      if (member.class !== undefined) updateData.class = member.class;
      if (member.thesisContent !== undefined) updateData.thesis_content = member.thesisContent;
      if (member.otherInfo !== undefined) updateData.other_info = member.otherInfo;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setMembers(prev => prev.map(m => m.id === id ? { ...m, ...member, updatedAt: new Date() } : m));
      logActivity('编辑', '成员名单', `编辑成员: ${member.name || id}`);
    } catch (error) {
      console.error('Error updating member:', error);
      alert('更新成员失败，请重试');
    }
  };

  const deleteMember = async (id: string) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以删除成员');
      return;
    }

    try {
      const member = members.find(m => m.id === id);
      
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== id));
      logActivity('删除', '成员名单', `删除成员: ${member?.name || id}`);
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('删除成员失败，请重试');
    }
  };

  // Duty schedule operations
  const addDutySchedule = async (schedule: Omit<DutySchedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('duty_schedules')
        .insert({
          date: schedule.date,
          members: schedule.members,
          tasks: schedule.tasks,
          status: schedule.status,
          notes: schedule.notes
        })
        .select()
        .single();

      if (error) throw error;

      const newSchedule: DutySchedule = {
        id: data.id,
        date: data.date,
        members: data.members,
        tasks: data.tasks,
        status: data.status,
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setDutySchedules(prev => [newSchedule, ...prev]);
      logActivity('添加', '卫生值日', `添加值日安排: ${schedule.date}`);
    } catch (error) {
      console.error('Error adding duty schedule:', error);
      alert('添加值日安排失败，请重试');
    }
  };

  const updateDutySchedule = async (id: string, schedule: Partial<DutySchedule>) => {
    try {
      const updateData: any = {};
      if (schedule.date) updateData.date = schedule.date;
      if (schedule.members) updateData.members = schedule.members;
      if (schedule.tasks) updateData.tasks = schedule.tasks;
      if (schedule.status) updateData.status = schedule.status;
      if (schedule.notes !== undefined) updateData.notes = schedule.notes;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('duty_schedules')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setDutySchedules(prev => prev.map(d => d.id === id ? { ...d, ...schedule, updatedAt: new Date() } : d));
      logActivity('编辑', '卫生值日', `编辑值日安排: ${schedule.date || id}`);
    } catch (error) {
      console.error('Error updating duty schedule:', error);
      alert('更新值日安排失败，请重试');
    }
  };

  const deleteDutySchedule = async (id: string) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以删除值日安排');
      return;
    }

    try {
      const schedule = dutySchedules.find(d => d.id === id);
      
      const { error } = await supabase
        .from('duty_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDutySchedules(prev => prev.filter(d => d.id !== id));
      logActivity('删除', '卫生值日', `删除值日安排: ${schedule?.date || id}`);
    } catch (error) {
      console.error('Error deleting duty schedule:', error);
      alert('删除值日安排失败，请重试');
    }
  };

  // Medium operations
  const addMedium = async (medium: Omit<Medium, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('media')
        .insert({
          name: medium.name,
          type: medium.type || 'solid',
          suitable_strains: medium.suitableStrains,
          formula: medium.formula,
          cultivation_params: medium.cultivationParams || {
            temperature: '',
            time: '',
            ph: '',
            other: ''
          },
          recommended_by: medium.recommendedBy
        })
        .select()
        .single();

      if (error) throw error;

      const newMedium: Medium = {
        id: data.id,
        name: data.name,
        type: data.type,
        suitableStrains: data.suitable_strains,
        formula: data.formula,
        cultivationParams: data.cultivation_params,
        recommendedBy: data.recommended_by,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setMedia(prev => [newMedium, ...prev]);
      logActivity('添加', '培养基推荐', `添加培养基: ${medium.name}`);
    } catch (error) {
      console.error('Error adding medium:', error);
      alert('添加培养基失败，请重试');
    }
  };

  const updateMedium = async (id: string, medium: Partial<Medium>) => {
    try {
      const updateData: any = {};
      if (medium.name) updateData.name = medium.name;
      if (medium.type) updateData.type = medium.type;
      if (medium.suitableStrains) updateData.suitable_strains = medium.suitableStrains;
      if (medium.formula) updateData.formula = medium.formula;
      if (medium.cultivationParams) updateData.cultivation_params = medium.cultivationParams;
      if (medium.recommendedBy) updateData.recommended_by = medium.recommendedBy;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('media')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setMedia(prev => prev.map(m => m.id === id ? { ...m, ...medium, updatedAt: new Date() } : m));
      logActivity('编辑', '培养基推荐', `编辑培养基: ${medium.name || id}`);
    } catch (error) {
      console.error('Error updating medium:', error);
      alert('更新培养基失败，请重试');
    }
  };

  const deleteMedium = async (id: string) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以删除培养基');
      return;
    }

    try {
      const medium = media.find(m => m.id === id);
      
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMedia(prev => prev.filter(m => m.id !== id));
      logActivity('删除', '培养基推荐', `删除培养基: ${medium?.name || id}`);
    } catch (error) {
      console.error('Error deleting medium:', error);
      alert('删除培养基失败，请重试');
    }
  };

  // Thesis operations
  const addThesis = async (thesis: Omit<Thesis, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('theses')
        .insert({
          title: thesis.title,
      <div className="relative p-4 sm:p-6 pb-6 sm:pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full 
                       -translate-y-16 translate-x-16 sm:-translate-y-20 sm:translate-x-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full 
                       translate-y-12 -translate-x-12 sm:translate-y-16 sm:-translate-x-16 animate-float" style={{ animationDelay: '2s' }}></div>

      if (error) throw error;

              <h1 className="cyber-text-xl font-bold animate-slide-in-left gradient-text-cyber">🧪 实验室</h1>
              <p className="text-white/80 text-sm sm:text-base">{user?.username}</p>
        title: data.title,
                <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                               text-xs rounded-full border border-white/30 animate-pulse-slow backdrop-blur-md">
        class: data.class,
        otherContent: data.other_content,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setTheses(prev => [newThesis, ...prev]);
      logActivity('添加', '历届毕业论文', `添加论文: ${thesis.title}`);
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 hover:scale-110"
      console.error('Error adding thesis:', error);
      alert('添加论文失败，请重试');
    }
  };

  const updateThesis = async (id: string, thesis: Partial<Thesis>) => {
    try {
      const updateData: any = {};
              <p className="text-xs sm:text-sm text-white/60">今天是</p>
      if (thesis.author) updateData.author = thesis.author;
      if (thesis.grade) updateData.grade = thesis.grade;
      if (thesis.class) updateData.class = thesis.class;
      if (thesis.otherContent !== undefined) updateData.other_content = thesis.otherContent;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('theses')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setTheses(prev => prev.map(t => t.id === id ? { ...t, ...thesis, updatedAt: new Date() } : t));
      logActivity('编辑', '历届毕业论文', `编辑论文: ${thesis.title || id}`);
    } catch (error) {
      console.error('Error updating thesis:', error);
      alert('更新论文失败，请重试');
        <div className="cyber-grid-2 mb-6 sm:mb-8">
  };

  const deleteThesis = async (id: string) => {
              className="glass-card cursor-pointer animate-fade-in-up card-hover-effect group touch-target" 
      alert('只有管理员可以删除论文');
      return;
    }

    try {
                               shadow-lg group-hover:neon-glow transition-all duration-500 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      const { error } = await supabase
                    className="sm:w-5 sm:h-5 text-white group-hover:scale-125 transition-transform duration-500 relative z-10" 
        .delete()
        .eq('id', id);

      if (error) throw error;
                  className="sm:w-4 sm:h-4 text-white/40 group-hover:text-purple-400 
                           group-hover:translate-x-2 transition-all duration-500" 
      logActivity('删除', '历届毕业论文', `删除论文: ${thesis?.title || id}`);
    } catch (error) {
      console.error('Error deleting thesis:', error);
      alert('删除论文失败，请重试');
                               group-hover:gradient-text-cyber transition-all duration-500 text-white">
  };

  // Export functions
              <h3 className="font-semibold text-sm sm:text-base text-white/90 mb-1 
                           group-hover:text-white transition-colors duration-500">
    let filename = '';
    
              <p className="text-xs text-white/60 truncate leading-tight group-hover:text-white/80 transition-colors duration-300">{card.recent}</p>
      case 'strains':
        data = strains.map(strain => ({
          菌种名称: strain.name,
          学名: strain.scientificName,
          类型: strain.type,
          来源: strain.source,
          保藏方法: strain.preservationMethod,
            <div className="glass-card bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30 pulse-glow">
              <h3 className="font-semibold text-sm sm:text-base text-white mb-2 
          描述: strain.description,
          添加人: strain.addedBy,
          添加时间: new Date(strain.addedAt).toLocaleString()
        }));
        filename = '菌种保藏数据';
        break;
                <p className="text-white/90 text-sm sm:text-base">
        data = members.map(member => ({
          姓名: member.name,
                <p className="text-white/80 text-xs sm:text-sm">
          电话: member.phone,
          年级: member.grade || '',
          班级: member.class || '',
                  todayDuty.status === 'completed' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                  todayDuty.status === 'skipped' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                  'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
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
                className="glass-card cursor-pointer bg-gradient-to-r from-purple-500/20 to-pink-500/20
                         border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30
                         transition-all duration-500 card-hover-effect group touch-target neon-glow"
  const importData = async (module: string, file: File) => {
    try {
      const data = await importFromExcel(file);
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-600 to-pink-600 
                                 text-white rounded-lg sm:rounded-xl group-hover:neon-glow 
                                 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          for (const item of data) {
            await addStrain({
                      className="sm:w-5 sm:h-5 group-hover:scale-125 transition-transform duration-500 relative z-10" 
              scientificName: item['学名'] || item.scientificName || '',
              type: item['类型'] || item.type || '真菌',
              source: item['来源'] || item.source || '',
                    <h3 className="font-semibold text-sm sm:text-base text-white 
                                 group-hover:gradient-text-cyber transition-all duration-500">
              location: item['保藏位置'] || item.location || '',
              description: item['描述'] || item.description || '',
                    <p className="text-white/70 text-xs sm:text-sm">管理系统用户和权限</p>
            });
          }
          break;
                    className="sm:w-4 sm:h-4 text-white/60 group-hover:text-purple-400 group-hover:translate-x-2 
                             transition-all duration-500" 
            await addMember({
              name: item['姓名'] || item.name || '',
              group: item['组别'] || item.group || '',
              phone: item['电话'] || item.phone || '',
              grade: item['年级'] || item.grade || '',
              class: item['班级'] || item.class || '',
          <h2 className="cyber-text-lg font-semibold text-white mb-3 sm:mb-4 
              otherInfo: item['其他信息'] || item.otherInfo || ''
            });
          }
          break;
        case 'media':
          for (const item of data) {
            <div className="glass-card text-center card-hover-effect group touch-target">
              name: item['培养基名称'] || item.name || '',
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-400 to-emerald-500 
                               text-white rounded-lg group-hover:neon-glow 
                               transition-all duration-500">
              cultivationParams: {
                temperature: item['培养温度'] || item.cultivationParams?.temperature || '',
                    className="sm:w-4 sm:h-4 group-hover:scale-125 transition-transform duration-500" 
                ph: item['pH值'] || item.cultivationParams?.ph || '',
                other: item['其他参数'] || item.cultivationParams?.other || ''
              },
                  <p className="text-base sm:text-lg font-bold text-white 
                               group-hover:gradient-text-cyber transition-all duration-500">
          }
          break;
                  <p className="text-xs text-white/60">总数据量</p>
          for (const item of data) {
            await addThesis({
              title: item['论文题目'] || item.title || '',
              author: item['作者'] || item.author || '',
            <div className="glass-card text-center card-hover-effect group touch-target">
              class: item['班级'] || item.class || '',
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-400 to-purple-500 
                               text-white rounded-lg group-hover:neon-glow 
                               transition-all duration-500">
          break;
      }
                    className="sm:w-4 sm:h-4 group-hover:scale-125 transition-transform duration-500" 
      logActivity('导入', module, `从Excel导入${data.length}条数据`);
      return data;
    } catch (error) {
                  <p className="text-base sm:text-lg font-bold text-white 
                               group-hover:gradient-text-cyber transition-all duration-500">
    }
  };
                  <p className="text-xs text-white/60">30天活动</p>
  const downloadTemplate = (module: string) => {
    downloadExcelTemplate(module);
    logActivity('下载', '模板', `下载${module}导入模板`);
  };

  const value: AppContextType = {
    // State
    strains,
          <h2 className="cyber-text-lg font-semibold text-white mb-3 sm:mb-4 
    dutySchedules,
    media,
    theses,
    activityLogs,
    
              <div key={log.id} className="glass-card card-hover-effect group touch-target">
    addStrain,
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-gray-400 to-gray-500 
                                 text-white rounded-lg group-hover:neon-glow 
                                 transition-all duration-500">
    // Member operations
    addMember,
                      className="sm:w-3.5 sm:h-3.5 group-hover:scale-125 transition-transform duration-500" 
    deleteMember,
    
    // Duty schedule operations
                    <p className="font-medium text-sm sm:text-base text-white/90 
                                 group-hover:text-white transition-colors duration-500">
    deleteDutySchedule,
    
                    <p className="text-xs text-white/60 leading-tight">
    addMedium,
    updateMedium,
    deleteMedium,
    
    // Thesis operations
    addThesis,
    updateThesis,
    deleteThesis,
    
    // Import/Export operations
        <div className="text-center py-4 sm:py-6 border-t border-white/20">
          <p className="text-xs text-white/60 leading-relaxed">
    downloadTemplate,
    logActivity
          <p className="text-xs text-white/50 mt-1 leading-relaxed">

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};