import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../../components/Common/Modal';
import { Thesis } from '../../types';

interface ThesisFormProps {
  thesis?: Thesis | null;
  onClose: () => void;
}

const ThesisForm: React.FC<ThesisFormProps> = ({ thesis, onClose }) => {
  const { addThesis, updateThesis } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    grade: '',
    class: '',
    otherContent: ''
  });

  useEffect(() => {
    if (thesis) {
      setFormData({
        title: thesis.title,
        author: thesis.author,
        grade: thesis.grade,
        class: thesis.class,
        otherContent: thesis.otherContent
      });
    }
  }, [thesis]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (thesis) {
      updateThesis(thesis.id, formData);
    } else {
      addThesis(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={thesis ? '编辑论文' : '添加毕业论文'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            论文题目 *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="modern-input"
            placeholder="请输入论文题目"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            作者姓名 *
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="modern-input"
            placeholder="请输入作者姓名"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              年级 *
            </label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="modern-input"
              placeholder="如：2023级"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              班级 *
            </label>
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="modern-input"
              placeholder="如：生物技术1班"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            其它内容
          </label>
          <textarea
            name="otherContent"
            value={formData.otherContent}
            onChange={handleChange}
            className="modern-input resize-none"
            rows={4}
            placeholder="请输入论文摘要、关键词、指导老师等其它相关信息..."
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
            {thesis ? '更新' : '添加'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ThesisForm;