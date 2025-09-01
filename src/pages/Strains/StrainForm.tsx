import React, { useState, useEffect } from 'react';
import { X, Save, Download } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Strain } from '../../types';

interface StrainFormProps {
  strain?: Strain;
  onClose: () => void;
}

const StrainForm: React.FC<StrainFormProps> = ({ strain, onClose }) => {
  const { user } = useAuth();
  const { downloadTemplate, addStrain, updateStrain } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    type: 'true_fungi' as 'true_fungi' | 'bacteria' | 'other',
    source: '',
    preservationMethod: '',
    preservationTemperature: '',
    location: '',
    description: '',
    addedBy: user?.username || '',
    transferReminder: {
      enabled: false,
      intervalDays: 30,
      lastTransferDate: undefined,
      nextReminderDate: undefined
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (strain) {
      setFormData({
        name: strain.name,
        scientificName: strain.scientificName,
        type: strain.type,
        source: strain.source,
        preservationMethod: strain.preservationMethod,
        preservationTemperature: strain.preservationTemperature || '',
        location: strain.location,
        description: strain.description,
        addedBy: strain.addedBy
      });
    }
  }, [strain]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '菌种名称不能为空';
    }
    if (!formData.scientificName.trim()) {
      newErrors.scientificName = '学名不能为空';
    }
    if (!formData.source.trim()) {
      newErrors.source = '来源不能为空';
    }
    if (!formData.preservationMethod.trim()) {
      newErrors.preservationMethod = '保藏方法不能为空';
    }
    if (!formData.preservationTemperature.trim()) {
      newErrors.preservationTemperature = '保藏温度不能为空';
    }
    if (!formData.location.trim()) {
      newErrors.location = '保藏位置不能为空';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (strain) {
        updateStrain(strain.id, formData);
      } else {
        addStrain(formData);
      }
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplate('strains');
  };

  const typeOptions = [
    { value: 'true_fungi', label: '真菌' },
    { value: 'bacteria', label: '细菌' },
    { value: 'other', label: '其它' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {strain ? '编辑菌种' : '添加菌种'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="下载模板"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              转接提醒设置
            </label>
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.transferReminder.enabled}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    transferReminder: {
                      ...prev.transferReminder,
                      enabled: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">启用转接提醒</span>
              </label>
              
              {formData.transferReminder.enabled && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    提醒间隔（天）
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={formData.transferReminder.intervalDays}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      transferReminder: {
                        ...prev.transferReminder,
                        intervalDays: parseInt(e.target.value) || 30
                      }
                    }))}
                    className="modern-input"
                    placeholder="30"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                菌种名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`modern-input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="请输入菌种名称"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学名 *
              </label>
              <input
                type="text"
                value={formData.scientificName}
                onChange={(e) => handleInputChange('scientificName', e.target.value)}
                className={`modern-input ${errors.scientificName ? 'border-red-500' : ''}`}
                placeholder="请输入学名"
              />
              {errors.scientificName && <p className="text-red-500 text-sm mt-1">{errors.scientificName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                菌种类型 *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="modern-input"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                来源 *
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className={`modern-input ${errors.source ? 'border-red-500' : ''}`}
                placeholder="请输入菌种来源"
              />
              {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                保藏方法 *
              </label>
              <input
                type="text"
                value={formData.preservationMethod}
                onChange={(e) => handleInputChange('preservationMethod', e.target.value)}
                className={`modern-input ${errors.preservationMethod ? 'border-red-500' : ''}`}
                placeholder="请输入保藏方法"
              />
              {errors.preservationMethod && <p className="text-red-500 text-sm mt-1">{errors.preservationMethod}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                保藏温度 *
              </label>
              <input
                type="text"
                value={formData.preservationTemperature}
                onChange={(e) => handleInputChange('preservationTemperature', e.target.value)}
                className={`modern-input ${errors.preservationTemperature ? 'border-red-500' : ''}`}
                placeholder="例如：4°C、-20°C、室温"
              />
              {errors.preservationTemperature && <p className="text-red-500 text-sm mt-1">{errors.preservationTemperature}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                保藏位置 *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`modern-input ${errors.location ? 'border-red-500' : ''}`}
                placeholder="请输入保藏位置"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述信息
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="modern-input min-h-[100px] resize-none"
                placeholder="请输入菌种描述信息（可选）"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {strain ? '更新' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StrainForm;