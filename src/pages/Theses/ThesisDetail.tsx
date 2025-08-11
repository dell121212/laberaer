import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Common/Modal';
import { Thesis } from '../../types';
import { Edit2, Trash2, Calendar, User, GraduationCap, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ThesisDetailProps {
  thesis: Thesis;
  onClose: () => void;
  onEdit: (thesis: Thesis) => void;
}

const ThesisDetail: React.FC<ThesisDetailProps> = ({ thesis, onClose, onEdit }) => {
  const { deleteThesis } = useApp();
  const { user } = useAuth();

  const handleDelete = () => {
    if (window.confirm('确定要删除这篇论文吗？此操作不可恢复。')) {
      deleteThesis(thesis.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="论文详情"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center pb-4 border-b border-secondary-200">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 
                         rounded-2xl flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2 leading-tight">
            {thesis.title}
          </h2>
          <p className="text-secondary-600">毕业论文</p>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <User size={16} className="text-secondary-500" />
              <div>
                <p className="text-sm text-secondary-500">作者</p>
                <p className="font-medium text-secondary-800">{thesis.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap size={16} className="text-secondary-500" />
              <div>
                <p className="text-sm text-secondary-500">年级班级</p>
                <p className="font-medium text-secondary-800">{thesis.grade} {thesis.class}</p>
              </div>
            </div>

            {thesis.otherContent && (
              <div className="flex items-start gap-3">
                <FileText size={16} className="text-secondary-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-secondary-500 mb-2">其它内容</p>
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <p className="text-secondary-700 text-sm whitespace-pre-wrap leading-relaxed">
                      {thesis.otherContent}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-secondary-500" />
              <div>
                <p className="text-sm text-secondary-500">添加时间</p>
                <p className="font-medium text-secondary-800">
                  {format(new Date(thesis.createdAt), 'yyyy年MM月dd日 HH:mm')}
                </p>
              </div>
            </div>

            {thesis.updatedAt && new Date(thesis.updatedAt).getTime() !== new Date(thesis.createdAt).getTime() && (
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-secondary-500" />
                <div>
                  <p className="text-sm text-secondary-500">最后更新</p>
                  <p className="font-medium text-secondary-800">
                    {format(new Date(thesis.updatedAt), 'yyyy年MM月dd日 HH:mm')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-secondary-200">
          <button
            onClick={() => onEdit(thesis)}
            className="flex-1 btn-secondary flex items-center justify-center gap-2"
          >
            <Edit2 size={16} />
            编辑
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={handleDelete}
              className="flex-1 bg-error-600 hover:bg-error-700 text-white px-6 py-3 rounded-xl 
                       font-medium transition-all duration-200 shadow-soft hover:shadow-medium 
                       active:scale-95 flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              删除
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ThesisDetail;