import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Common/Modal';
import { DutySchedule } from '../../types';
import { Edit2, Trash2, Calendar, Users, CheckSquare, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface DutyDetailProps {
  duty: DutySchedule;
  onClose: () => void;
  onEdit: (duty: DutySchedule) => void;
}

const DutyDetail: React.FC<DutyDetailProps> = ({ duty, onClose, onEdit }) => {
  const { deleteDutySchedule } = useApp();
  const { user } = useAuth();

  const handleDelete = () => {
    if (window.confirm('确定要删除这个值日安排吗？此操作不可恢复。')) {
      deleteDutySchedule(duty.id);
      onClose();
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: '已完成', color: 'text-green-600 bg-green-100' };
      case 'skipped':
        return { text: '已跳过', color: 'text-red-600 bg-red-100' };
      default:
        return { text: '待执行', color: 'text-orange-600 bg-orange-100' };
    }
  };

  const statusInfo = getStatusInfo(duty.status);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="值日详情"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center pb-4 border-b border-ink-200">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">
            {format(new Date(duty.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
          </h2>
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Users size={16} className="text-ink-500 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-ink-500 mb-1">值日人员</p>
              <div className="space-y-1">
                {duty.members.map((member, index) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-1 bg-ink-100 text-ink-700 rounded-lg text-sm mr-1 mb-1"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckSquare size={16} className="text-ink-500 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-ink-500 mb-1">值日任务</p>
              <div className="space-y-1">
                {duty.tasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-ink-400 rounded-full"></div>
                    <span className="text-ink-700 text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {duty.notes && (
            <div className="flex items-start gap-3">
              <MessageSquare size={16} className="text-ink-500 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-ink-500 mb-1">备注</p>
                <p className="text-ink-700 bg-paper-200 p-3 rounded-lg text-sm">{duty.notes}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-ink-500" />
            <div>
              <p className="text-sm text-ink-500">创建时间</p>
              <p className="font-medium text-ink-800">
                {format(new Date(duty.createdAt), 'yyyy年MM月dd日 HH:mm')}
              </p>
            </div>
          </div>

          {duty.updatedAt && new Date(duty.updatedAt).getTime() !== new Date(duty.createdAt).getTime() && (
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">最后更新</p>
                <p className="font-medium text-ink-800">
                  {format(new Date(duty.updatedAt), 'yyyy年MM月dd日 HH:mm')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-ink-200">
          <button
            onClick={() => onEdit(duty)}
            className="flex-1 ink-button-secondary flex items-center justify-center gap-2"
          >
            <Edit2 size={16} />
            编辑
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-paper-50 px-6 py-3 rounded-lg 
                       font-medium transition-all duration-200 shadow-md hover:shadow-lg 
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

export default DutyDetail;