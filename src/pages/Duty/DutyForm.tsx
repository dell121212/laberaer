import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../../components/Common/Modal';
import { DutySchedule } from '../../types';
import { format } from 'date-fns';

interface DutyFormProps {
  duty?: DutySchedule | null;
  onClose: () => void;
}

const DutyForm: React.FC<DutyFormProps> = ({ duty, onClose }) => {
  const { addDutySchedule, updateDutySchedule, members } = useApp();
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    members: [] as string[],
    tasks: [] as string[],
    status: 'pending' as 'pending' | 'completed' | 'skipped',
    notes: ''
  });

  const commonTasks = [
    '清洁实验台', '消毒设备', '整理试剂', '清洗器皿', '垃圾清理', '拖地清洁', '通风检查'
  ];

  useEffect(() => {
    if (duty) {
      setFormData({
        date: duty.date,
        members: duty.members,
        tasks: duty.tasks,
        status: duty.status,
        notes: duty.notes || ''
      });
    }
  }, [duty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (duty) {
      updateDutySchedule(duty.id, formData);
    } else {
      addDutySchedule(formData);
    }
    
    onClose();
  };

  const handleMemberToggle = (memberName: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(memberName)
        ? prev.members.filter(m => m !== memberName)
        : [...prev.members, memberName]
    }));
  };

  const handleTaskToggle = (task: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.includes(task)
        ? prev.tasks.filter(t => t !== task)
        : [...prev.tasks, task]
    }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={duty ? '编辑值日安排' : '添加值日安排'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            值日日期 *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="ink-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            值日人员 *
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {members.map(member => (
              <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.members.includes(member.name)}
                  onChange={() => handleMemberToggle(member.name)}
                  className="rounded border-ink-300 text-ink-600 focus:ring-ink-500"
                />
                <span className="text-sm text-ink-700">{member.name}</span>
              </label>
            ))}
          </div>
          {formData.members.length === 0 && (
            <p className="text-red-500 text-xs mt-1">请至少选择一位值日人员</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            值日任务 *
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {commonTasks.map(task => (
              <label key={task} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.tasks.includes(task)}
                  onChange={() => handleTaskToggle(task)}
                  className="rounded border-ink-300 text-ink-600 focus:ring-ink-500"
                />
                <span className="text-sm text-ink-700">{task}</span>
              </label>
            ))}
          </div>
          {formData.tasks.length === 0 && (
            <p className="text-red-500 text-xs mt-1">请至少选择一项值日任务</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            状态
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="ink-input"
          >
            <option value="pending">待执行</option>
            <option value="completed">已完成</option>
            <option value="skipped">已跳过</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            备注
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="ink-input resize-none"
            rows={3}
            placeholder="可选择性添加备注信息..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 ink-button-secondary"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={formData.members.length === 0 || formData.tasks.length === 0}
            className="flex-1 ink-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {duty ? '更新' : '添加'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DutyForm;