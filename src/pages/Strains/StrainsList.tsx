import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import SearchBar from '../../components/Common/SearchBar';
import FloatingActionButton from '../../components/Common/FloatingActionButton';
import ImportExportButtons from '../../components/Common/ImportExportButtons';
import StrainForm from './StrainForm';
import StrainDetail from './StrainDetail';
import { Beaker, Filter } from 'lucide-react';
import { format } from 'date-fns';

const StrainsList: React.FC = () => {
  const { strains } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStrain, setEditingStrain] = useState(null);
  const [selectedStrain, setSelectedStrain] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const strainTypes = [...new Set(strains.map(strain => strain.type))];

  const filteredStrains = strains.filter(strain => {
    const matchesSearch = strain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         strain.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || strain.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddStrain = () => {
    setEditingStrain(null);
    setShowForm(true);
  };

  const handleEditStrain = (strain: any) => {
    setEditingStrain(strain);
    setSelectedStrain(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Beaker size={24} className="text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">菌种保藏</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Filter size={18} className="text-gray-600" />
              </button>
              <ImportExportButtons module="strains" />
            </div>
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索菌种名称或描述..."
          />
          
          {showFilters && (
            <div className="mt-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="modern-input"
              >
                <option value="">所有类型</option>
                {strainTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="modern-card mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredStrains.length}</p>
              <p className="text-gray-600">菌种总数</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">最近添加</p>
              <p className="font-medium text-gray-800">
                {strains.length > 0 ? 
                  strains.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())[0].name :
                  '暂无数据'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Strains List */}
        <div className="space-y-3">
          {filteredStrains.map((strain, index) => (
            <div 
              key={strain.id} 
              className="modern-card cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setSelectedStrain(strain)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 flex-1 pr-2">
                  {strain.name}
                </h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">
                  {strain.type}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {strain.description}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>来源：{strain.source}</span>
                <span>{format(new Date(strain.addedAt), 'MM-dd')}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredStrains.length === 0 && (
          <div className="text-center py-12">
            <Beaker size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">暂无菌种数据</p>
            <p className="text-gray-400 text-sm">点击右下角按钮添加菌种</p>
          </div>
        )}
      </div>

      <FloatingActionButton onClick={handleAddStrain} />

      {showForm && (
        <StrainForm
          strain={editingStrain}
          onClose={() => setShowForm(false)}
        />
      )}

      {selectedStrain && (
        <StrainDetail
          strain={selectedStrain}
          onClose={() => setSelectedStrain(null)}
          onEdit={handleEditStrain}
        />
      )}
    </div>
  );
};

export default StrainsList;