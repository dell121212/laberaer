import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Common/Modal';
import { Strain } from '../../types';
import { Edit2, Trash2, Calendar, User, MapPin, FlaskConical } from 'lucide-react';
import { format } from 'date-fns';

interface StrainDetailProps {
  strain: Strain;
  onClose: () => void;
  onEdit: (strain: Strain) => void;
}

const StrainDetail: React.FC<StrainDetailProps> = ({ strain, onClose, onEdit }) => {
  const { deleteStrain } = useApp();
  const { user } = useAuth();

  const handleDelete = () => {
    if (window.confirm('确定要删除这个菌种吗？此操作不可恢复。')) {
      deleteStrain(strain.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="菌种详情"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center pb-4 border-b border-ink-200">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">{strain.name}</h2>
          <p className="text-ink-600 text-sm mb-2">{strain.scientificName}</p>
          <span className="inline-block px-3 py-1 bg-ink-100 text-ink-700 rounded-full text-sm">
            {strain.type}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {strain.description && (
            <div>
              <h3 className="font-medium text-ink-800 mb-2">描述信息</h3>
              <p className="text-ink-600 bg-paper-200 p-3 rounded-lg">{strain.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">来源</p>
                <p className="font-medium text-ink-800">{strain.source || '未指定'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FlaskConical size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">保藏方法</p>
                <p className="font-medium text-ink-800">{strain.preservationMethod}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FlaskConical size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">保藏温度</p>
                <p className="font-medium text-ink-800">{strain.preservationTemperature}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">保藏位置</p>
                <p className="font-medium text-ink-800">{strain.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">添加人</p>
                <p className="font-medium text-ink-800">{strain.addedBy}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">添加时间</p>
                <p className="font-medium text-ink-800">
                  {format(new Date(strain.addedAt), 'yyyy年MM月dd日 HH:mm')}
                </p>
              </div>
            </div>

            {strain.updatedAt && new Date(strain.updatedAt).getTime() !== new Date(strain.addedAt).getTime() && (
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-ink-500" />
                <div>
                  <p className="text-sm text-ink-500">最后更新</p>
                  <p className="font-medium text-ink-800">
                    {format(new Date(strain.updatedAt), 'yyyy年MM月dd日 HH:mm')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-ink-200">
          <button
            onClick={() => onEdit(strain)}
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

export default StrainDetail;