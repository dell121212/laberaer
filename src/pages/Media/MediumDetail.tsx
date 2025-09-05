import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Common/Modal';
import { Medium } from '../../types';
import { Edit2, Trash2, Calendar, User, FlaskConical, Beaker } from 'lucide-react';
import { format } from 'date-fns';

interface MediumDetailProps {
  medium: Medium;
  onClose: () => void;
  onEdit: (medium: Medium) => void;
}

const MediumDetail: React.FC<MediumDetailProps> = ({ medium, onClose, onEdit }) => {
  const { deleteMedium, strains } = useApp();
  const { user } = useAuth();

  const handleDelete = () => {
    if (window.confirm('确定要删除这个培养基推荐吗？此操作不可恢复。')) {
      deleteMedium(medium.id);
      onClose();
    }
  };

  const getStrainName = (strainId: string) => {
    const strain = strains.find(s => s.id === strainId);
    return strain ? strain.name : '未知菌种';
  };

  const getStrainType = (strainId: string) => {
    const strain = strains.find(s => s.id === strainId);
    return strain ? strain.type : '';
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="培养基详情"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center pb-4 border-b border-ink-200">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 
                         rounded-full flex items-center justify-center mx-auto mb-3">
            <FlaskConical className="text-paper-50" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-ink-900 mb-2">{medium.name}</h2>
          <p className="text-ink-600">推荐培养基配方</p>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Beaker size={16} className="text-ink-500 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-ink-500 mb-2">适用菌种</p>
              <div className="space-y-2">
                {medium.suitableStrains.map((strainId) => (
                  <div 
                    key={strainId}
                    className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
                  >
                    <span className="font-medium text-blue-900">{getStrainName(strainId)}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {getStrainType(strainId)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-ink-800 mb-2">培养基配方</h3>
            <div className="bg-paper-200 p-4 rounded-lg">
              <pre className="text-ink-700 text-sm whitespace-pre-wrap font-serif leading-relaxed">
                {medium.formula}
              </pre>
            </div>
          </div>

          {(medium.cultivationParams?.temperature || medium.cultivationParams?.time || medium.cultivationParams?.ph || medium.cultivationParams?.other) && (
            <div>
              <h3 className="font-medium text-secondary-800 mb-3">培养参数</h3>
              <div className="grid grid-cols-2 gap-3">
                {medium.cultivationParams.temperature && (
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <p className="text-xs text-secondary-500 mb-1">温度</p>
                    <p className="font-medium text-secondary-800">{medium.cultivationParams.temperature}</p>
                  </div>
                )}
                {medium.cultivationParams.time && (
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <p className="text-xs text-secondary-500 mb-1">时间</p>
                    <p className="font-medium text-secondary-800">{medium.cultivationParams.time}</p>
                  </div>
                )}
                {medium.cultivationParams.ph && (
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <p className="text-xs text-secondary-500 mb-1">pH值</p>
                    <p className="font-medium text-secondary-800">{medium.cultivationParams.ph}</p>
                  </div>
                )}
                {medium.cultivationParams.other && (
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <p className="text-xs text-secondary-500 mb-1">其他参数</p>
                    <p className="font-medium text-secondary-800">{medium.cultivationParams.other}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <User size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">推荐人</p>
                <p className="font-medium text-ink-800">{medium.recommendedBy}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-ink-500" />
              <div>
                <p className="text-sm text-ink-500">推荐时间</p>
                <p className="font-medium text-ink-800">
                  {format(new Date(medium.createdAt), 'yyyy年MM月dd日 HH:mm')}
                </p>
              </div>
            </div>

            {medium.updatedAt && new Date(medium.updatedAt).getTime() !== new Date(medium.createdAt).getTime() && (
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-ink-500" />
                <div>
                  <p className="text-sm text-ink-500">最后更新</p>
                  <p className="font-medium text-ink-800">
                    {format(new Date(medium.updatedAt), 'yyyy年MM月dd日 HH:mm')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-ink-200">
          <button
            onClick={() => onEdit(medium)}
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

export default MediumDetail;