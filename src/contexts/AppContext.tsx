import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
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

  // Load data from Supabase
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      // 加载菌种数据
      const { data: strainsData } = await supabase
        .from('strains')
        .select('*')
        .order('added_at', { ascending: false });

      if (strainsData) {
        setStrains(strainsData.map(item => ({
          id: item.id,
          name: item.name,
          scientificName: item.scientific_name,
          type: item.type,
          description: item.description,
          source: item.source,
          preservationMethod: item.preservation_method,
          preservationTemperature: item.preservation_temperature,
          location: item.location,
          addedBy: item.added_by,
          addedAt: new Date(item.added_at),
          updatedAt: new Date(item.updated_at)
        })));
      }

      // 加载成员数据
      const { data: membersData } = await supabase
        .from('members')
        .select('*')
        .order('joined_at', { ascending: false });

      if (membersData) {
        setMembers(membersData.map(item => ({
          id: item.id,
          name: item.name,
          group: item.group,
          phone: item.phone,
          grade: item.grade,
          class: item.class,
          thesisContent: item.thesis_content,
          otherInfo: item.other_info,
          joinedAt: new Date(item.joined_at),
          updatedAt: new Date(item.updated_at)
        })));
      }

      // 加载值日安排数据
      const { data: dutyData } = await supabase
        .from('duty_schedules')
        .select('*')
        .order('date', { ascending: false });

      if (dutyData) {
        setDutySchedules(dutyData.map(item => ({
          id: item.id,
          date: item.date,
          members: item.members,
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
      userId: user.id,
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
      console.log('🧪 开始添加菌种:', strain);
      
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

      if (error) {
        console.error('❌ 添加菌种失败:', error);
        throw error;
      }

      console.log('✅ 菌种添加成功:', data);

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
      alert(`添加菌种失败: ${error.message || '请重试'}`);
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
      console.log('👥 开始添加成员:', member);
      
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

      if (error) {
        console.error('❌ 添加成员失败:', error);
        throw error;
      }

      console.log('✅ 成员添加成功:', data);

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
      alert(`添加成员失败: ${error.message || '请重试'}`);
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
      console.log('📅 开始添加值日安排:', schedule);
      
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

      if (error) {
        console.error('❌ 添加值日安排失败:', error);
        throw error;
      }

      console.log('✅ 值日安排添加成功:', data);

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
      alert(`添加值日安排失败: ${error.message || '请重试'}`);
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
      console.log('🧫 开始添加培养基:', medium);
      
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
            other: '',
            storage_temperature: '',
            storage_time: ''
          },
          recommended_by: medium.recommendedBy
        })
        .select()
        .single();

      if (error) {
        console.error('❌ 添加培养基失败:', error);
        throw error;
      }

      console.log('✅ 培养基添加成功:', data);

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
      alert(`添加培养基失败: ${error.message || '请重试'}`);
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
      console.log('🎓 开始添加论文:', thesis);
      
      const { data, error } = await supabase
        .from('theses')
        .insert({
          title: thesis.title,
          author: thesis.author,
          grade: thesis.grade,
          class: thesis.class,
          other_content: thesis.otherContent
        })
        .select()
        .single();

      if (error) {
        console.error('❌ 添加论文失败:', error);
        throw error;
      }

      console.log('✅ 论文添加成功:', data);

      const newThesis: Thesis = {
        id: data.id,
        title: data.title,
        author: data.author,
        grade: data.grade,
        class: data.class,
        otherContent: data.other_content,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setTheses(prev => [newThesis, ...prev]);
      logActivity('添加', '历届毕业论文', `添加论文: ${thesis.title}`);
    } catch (error) {
      console.error('Error adding thesis:', error);
      alert(`添加论文失败: ${error.message || '请重试'}`);
    }
  };

  const updateThesis = async (id: string, thesis: Partial<Thesis>) => {
    try {
      const updateData: any = {};
      if (thesis.title) updateData.title = thesis.title;
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
    }
  };

  const deleteThesis = async (id: string) => {
    if (user?.role !== 'admin') {
      alert('只有管理员可以删除论文');
      return;
    }

    try {
      const thesis = theses.find(t => t.id === id);
      
      const { error } = await supabase
        .from('theses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTheses(prev => prev.filter(t => t.id !== id));
      logActivity('删除', '历届毕业论文', `删除论文: ${thesis?.title || id}`);
    } catch (error) {
      console.error('Error deleting thesis:', error);
      alert('删除论文失败，请重试');
    }
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
          for (const item of data) {
            await addStrain({
              name: item['菌种名称'] || item.name || '',
              scientificName: item['学名'] || item.scientificName || '',
              type: item['类型'] || item.type || '真菌',
              source: item['来源'] || item.source || '',
              preservationMethod: item['保藏方法'] || item.preservationMethod || '',
              preservationTemperature: item['保藏温度'] || item.preservationTemperature || '',
              location: item['保藏位置'] || item.location || '',
              description: item['描述'] || item.description || '',
              addedBy: item['添加人'] || item.addedBy || user?.username || '导入用户'
            });
          }
          break;
        case 'members':
          for (const item of data) {
            await addMember({
              name: item['姓名'] || item.name || '',
              group: item['组别'] || item.group || '',
              phone: item['电话'] || item.phone || '',
              grade: item['年级'] || item.grade || '',
              class: item['班级'] || item.class || '',
              thesisContent: item['毕设内容'] || item.thesisContent || '',
              otherInfo: item['其他信息'] || item.otherInfo || ''
            });
          }
          break;
        case 'media':
          for (const item of data) {
            await addMedium({
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
              recommendedBy: item['推荐人'] || item.recommendedBy || user?.username || '导入用户'
            });
          }
          break;
        case 'theses':
          for (const item of data) {
            await addThesis({
              title: item['论文题目'] || item.title || '',
              author: item['作者'] || item.author || '',
              grade: item['年级'] || item.grade || '',
              class: item['班级'] || item.class || '',
              otherContent: item['其他内容'] || item.otherContent || ''
            });
          }
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