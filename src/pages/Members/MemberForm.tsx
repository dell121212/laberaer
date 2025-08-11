import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../../components/Common/Modal';
import { Member } from '../../types';

interface MemberFormProps {
  member?: Member | null;
  onClose: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onClose }) => {
  const { addMember, updateMember } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    phone: '',
    grade: '',
    class: '',
    thesisContent: '',
    otherInfo: ''
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        group: member.group,
        phone: member.phone,
        grade: member.grade || '',
        class: member.class || '',
        thesisContent: member.thesisContent || '',
        otherInfo: member.otherInfo || ''
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (member) {
      updateMember(member.id, formData);
    } else {
      addMember(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const groups = [
    '功能组', '分子组', '栽培组', '研究生', '实验助理', '老师'
  ];

  const shouldShowGradeClass = !['研究生', '实验助理', '老师'].includes(formData.group);
  const shouldShowThesis = !['实验助理', '老师'].includes(formData.group);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={member ? '编辑成员' : '添加成员'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            姓名 *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="ink-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            组别 *
          </label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="modern-input"
            required
          >
            <option value="">请选择组别</option>
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            联系电话 *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="modern-input"
            placeholder="请输入手机号码"
            required
          />
        </div>

        {shouldShowGradeClass && (
          <>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                年级
              </label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="modern-input"
                placeholder="如：2023级"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                班级
              </label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="modern-input"
                placeholder="如：生物技术1班"
              />
            </div>
          </>
        )}

        {shouldShowThesis && (
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              毕设内容
            </label>
            <textarea
              name="thesisContent"
              value={formData.thesisContent}
              onChange={handleChange}
              className="modern-input resize-none"
              rows={3}
              placeholder="请输入毕业设计内容..."
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            其它信息
          </label>
          <textarea
            name="otherInfo"
            value={formData.otherInfo}
            onChange={handleChange}
            className="modern-input resize-none"
            rows={2}
            placeholder="其它补充信息..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary"
          >
            {member ? '更新' : '添加'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberForm;