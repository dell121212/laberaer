import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import SearchBar from '../../components/Common/SearchBar';
import FloatingActionButton from '../../components/Common/FloatingActionButton';
import ImportExportButtons from '../../components/Common/ImportExportButtons';
import MediumForm from './MediumForm';
import MediumDetail from './MediumDetail';
import { FlaskConical, Star, User } from 'lucide-react';
import { format } from 'date-fns';

const MediaList: React.FC = () => {
  const { media, strains } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMedium, setEditingMedium] = useState(null);
  const [selectedMedium, setSelectedMedium] = useState(null);

  const filteredMedia = media.filter(medium =>
    medium.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medium.recommendedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medium.suitableStrains.some(strainId => {
      const strain = strains.find(s => s.id === strainId);
      return strain?.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

  const handleAddMedium = () => {
    setEditingMedium(null);
    setShowForm(true);
  };

  const handleEditMedium = (medium: any) => {
    setEditingMedium(medium);
    setShowForm(true);
  };

  const getStrainName = (strainId: string) => {
    const strain = strains.find(s => s.id === strainId);
    return strain ? strain.name : '未知菌种';
  };

  return (
    <div className="min-h-screen bg-paper-100 pb-20">
      {/* Header */}
      <div className="bg-ink-800 text-paper-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FlaskConical size={24} />
              <h1 className="text-xl font-bold">培养基推荐</h1>
            </div>
            <ImportExportButtons module="media" />
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索培养基名称、推荐人或适用菌种..."
          />
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="ink-card p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-ink-900">{filteredMedia.length}</p>
              <p className="text-ink-600">培养基总数</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink-600">最新推荐</p>
              <p className="font-medium text-ink-800">
                {media.length > 0 ? 
                  media.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].name :
                  '暂无数据'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Media List */}
        <div className="space-y-3">
          {filteredMedia.map((medium, index) => (
            <div 
              key={medium.id} 
              className="ink-card p-4 cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedMedium(medium)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-ink-900 flex-1">{medium.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    medium.type === 'liquid' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {medium.type === 'liquid' ? '液体' : '固体'}
                  </span>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Star size={14} />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-ink-600 mb-2">适用菌种：</p>
                <div className="flex flex-wrap gap-1">
                  {medium.suitableStrains.slice(0, 3).map((strainId) => (
                    <span 
                      key={strainId}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {getStrainName(strainId)}
                    </span>
                  ))}
                  {medium.suitableStrains.length > 3 && (
                    <span className="px-2 py-1 bg-ink-100 text-ink-600 text-xs rounded-full">
                      +{medium.suitableStrains.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-ink-500">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>推荐人：{medium.recommendedBy}</span>
                </div>
                <span>{format(new Date(medium.createdAt), 'MM-dd')}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <FlaskConical size={48} className="mx-auto text-ink-300 mb-4" />
            <p className="text-ink-500">暂无培养基推荐</p>
            <p className="text-ink-400 text-sm">点击右下角按钮添加培养基推荐</p>
          </div>
        )}
      </div>

      <FloatingActionButton onClick={handleAddMedium} />

      {showForm && (
        <MediumForm
          medium={editingMedium}
          onClose={() => setShowForm(false)}
        />
      )}

      {selectedMedium && (
        <MediumDetail
          medium={selectedMedium}
          onClose={() => setSelectedMedium(null)}
          onEdit={handleEditMedium}
        />
      )}
    </div>
  );
};

export default MediaList;