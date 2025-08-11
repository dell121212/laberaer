import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Common/Modal';
import { Medium } from '../../types';

interface MediumFormProps {
  medium?: Medium | null;
  onClose: () => void;
}

const MediumForm: React.FC<MediumFormProps> = ({ medium, onClose }) => {
  const { addMedium, updateMedium, strains } = useApp();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    suitableStrains: [] as string[],
    formula: '',
    recommendedBy: user?.username || ''
  });

  useEffect(() => {
    if (medium) {
      setFormData({
        name: medium.name,
        suitableStrains: medium.suitableStrains,
        formula: medium.formula,
        recommendedBy: medium.recommendedBy
      });
    }
  }, [medium, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (medium) {
      updateMedium(medium.id, formData);
    } else {
      addMedium(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStrainToggle = (strainId: string) => {
    setFormData(prev => ({
      ...prev,
      suitableStrains: prev.suitableStrains.includes(strainId)
        ? prev.suitableStrains.filter(id => id !== strainId)
        : [...prev.suitableStrains, strainId]
    }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={medium ? '编辑培养基' : '添加培养基推荐'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            培养基名称 *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="ink-input"
            placeholder="如：LB培养基、PDA培养基等"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            适用菌种 *
          </label>
          <div className="max-h-32 overflow-y-auto border border-ink-200 rounded-lg p-3 space-y-2">
            {strains.length === 0 ? (
              <p className="text-ink-500 text-sm">暂无菌种数据，请先添加菌种</p>
            ) : (
              strains.map(strain => (
                <label key={strain.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.suitableStrains.includes(strain.id)}
                    onChange={() => handleStrainToggle(strain.id)}
                    className="rounded border-ink-300 text-ink-600 focus:ring-ink-500"
                  />
                  <span className="text-sm text-ink-700">{strain.name}</span>
                  <span className="text-xs text-ink-500">({strain.type})</span>
                </label>
              ))
            )}
          </div>
          {formData.suitableStrains.length === 0 && (
            <p className="text-red-500 text-xs mt-1">请至少选择一种适用菌种</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            培养基配方 *
          </label>
          <textarea
            name="formula"
            value={formData.formula}
            onChange={handleChange}
            className="ink-input resize-none"
            rows={6}
            placeholder="请详细描述培养基的配方和制备方法..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            推荐人
          </label>
          <input
            type="text"
            name="recommendedBy"
            value={formData.recommendedBy}
            onChange={handleChange}
            className="ink-input"
            placeholder="推荐人姓名"
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
            disabled={formData.suitableStrains.length === 0}
            className="flex-1 ink-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {medium ? '更新' : '添加'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MediumForm;