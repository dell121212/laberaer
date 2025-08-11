import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../../components/Common/Modal';
import { Member } from '../../types';
import { Edit2, Trash2, Calendar, Mail, Phone, Building } from 'lucide-react';
import { format } from 'date-fns';

interface MemberDetailProps {
  member: Member;
  onClose: () => void;
  onEdit: (member: Member) => void;
}

const MemberDetail: React.FC<MemberDetailProps> = ({ member, onClose, onEdit }) => {
  const { deleteMember } = useApp();

  const handleDelete = () => {
    if (window.confirm('确定要删除这个成员吗？此操作不可恢复。')) {
      deleteMember(member.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="成员详情"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center pb-4 border-b border-ink-200">
          <div className="w-20 h-20 bg-gradient-to-r from-ink-600 to-ink-700 
                         rounded-full flex items-center justify-center text-paper-50 
                         font-bold text-2xl mx-auto mb-3">
            {member.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-ink-900 mb-1">{member.name}</h2>
          <p className="text-ink-600">{member.group}</p>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <Building size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">组别</p>
                <p className="font-medium text-ink-800">{member.group}</p>
              </div>
            </div>

            {member.grade && member.class && (
              <div className="flex items-center gap-3">
                <Building size={16} className="text-ink-500" />
                <div>
                  <p className="text-sm text-ink-500">年级班级</p>
                  <p className="font-medium text-ink-800">{member.grade} {member.class}</p>
                </div>
              </div>
            )}

            {member.phone && (
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-ink-500" />
                <div>
                  <p className="text-sm text-ink-500">电话</p>
                  <p className="font-medium text-ink-800">{member.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">加入时间</p>
                <p className="font-medium text-ink-800">
                  {format(new Date(member.joinedAt), 'yyyy年MM月dd日')}
                </p>
              </div>
            </div>

            {member.updatedAt && new Date(member.updatedAt).getTime() !== new Date(member.joinedAt).getTime() && (
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-ink-500" />
                <div>
                  <p className="text-sm text-ink-500">最后更新</p>
                  <p className="font-medium text-ink-800">
                    {format(new Date(member.updatedAt), 'yyyy年MM月dd日 HH:mm')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-ink-200">
          <button
            onClick={() => onEdit(member)}
            className="flex-1 ink-button-secondary flex items-center justify-center gap-2"
          >
            <Edit2 size={16} />
            编辑
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-paper-50 px-6 py-3 rounded-lg 
                     font-medium transition-all duration-200 shadow-md hover:shadow-lg 
                     active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            删除
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MemberDetail;