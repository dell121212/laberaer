import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../../components/Common/SearchBar';
import FloatingActionButton from '../../components/Common/FloatingActionButton';
import ImportExportButtons from '../../components/Common/ImportExportButtons';
import StrainForm from './StrainForm';
import StrainDetail from './StrainDetail';
import { Beaker, Filter, Download, Upload, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const StrainsList: React.FC = () => {
  const { strains } = useApp();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStrain, setEditingStrain] = useState(null);
  const [selectedStrain, setSelectedStrain] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showReminders, setShowReminders] = useState(false);

  // 检查需要转接提醒的菌种
  const strainsNeedingReminder = strains.filter(strain => {
    if (!strain.transferReminder?.enabled) return false;
    
    const now = new Date();
    const lastTransfer = strain.transferReminder.lastTransferDate 
      ? new Date(strain.transferReminder.lastTransferDate)
      : new Date(strain.addedAt);
    
    const daysSinceLastTransfer = Math.floor((now.getTime() - lastTransfer.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastTransfer >= strain.transferReminder.intervalDays;
  });

  // 显示提醒弹窗
  React.useEffect(() => {
    if (strainsNeedingReminder.length > 0) {
      setShowReminders(true);
    }
  }, [strainsNeedingReminder.length]);

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
    setShowForm(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['名称', '类型', '描述', '来源', '保藏方法', '添加人', '添加时间'],
      ...strains.map(strain => [
        strain.name,
        strain.type,
        strain.description,
        strain.source,
        strain.preservationMethod,
        strain.addedBy,
        format(new Date(strain.addedAt), 'yyyy-MM-dd HH:mm')
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `菌种数据_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-paper-100 pb-20 safe-area-padding">
      {/* Header */}
      <div className="bg-ink-800 text-paper-50 p-3 sm:p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-3">
              <Beaker size={20} className="sm:w-6 sm:h-6" />
              <h1 className="responsive-text-lg font-bold">菌种保藏</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg hover:bg-ink-700 transition-colors touch-target"
              >
                <Filter size={18} className="sm:w-5 sm:h-5" />
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
            <div className="mt-3 sm:mt-4 animate-slide-up">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="modern-input bg-paper-50 text-ink-800 border border-ink-200"
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
      <div className="max-w-md mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="modern-card mb-3 sm:mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="responsive-text-xl font-bold text-ink-900">{filteredStrains.length}</p>
              <p className="text-ink-600 text-sm sm:text-base">菌种总数</p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-ink-600">最近添加</p>
              <p className="font-medium text-ink-800 text-sm sm:text-base">
                {strains.length > 0 ? 
                  strains.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())[0].name :
                  '暂无数据'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Strains List */}
        <div className="space-y-2 sm:space-y-3">
          {filteredStrains.map((strain, index) => (
            <div 
              key={strain.id} 
              className="modern-card cursor-pointer hover:shadow-lg transition-all duration-200 
                       animate-fade-in card-hover-effect touch-target"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedStrain(strain)}
            >
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <h3 className="font-semibold text-sm sm:text-base text-ink-900 flex-1 pr-2">
                  {strain.name}
                </h3>
                <span className="px-2 py-0.5 sm:py-1 bg-ink-100 text-ink-700 text-xs rounded-full 
                               whitespace-nowrap">
                  {strain.type}
                </span>
              </div>
              <p className="text-ink-600 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2 leading-tight">
                {strain.description}
              </p>
              <div className="flex justify-between items-center text-xs text-ink-500">
                <span>来源：{strain.source}</span>
                <span>{format(new Date(strain.addedAt), 'MM-dd')}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredStrains.length === 0 && (
          <div className="text-center py-12">
            <Beaker size={40} className="sm:w-12 sm:h-12 mx-auto text-ink-300 mb-4" />
            <p className="text-ink-500">暂无菌种数据</p>
            <p className="text-ink-400 text-xs sm:text-sm">点击右下角按钮添加菌种</p>
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

      {/* Transfer Reminder Modal */}
      {showReminders && strainsNeedingReminder.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-warning-500 to-warning-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} />
                <h2 className="text-xl font-bold">转接提醒</h2>
              </div>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                以下菌种需要进行转接操作：
              </p>
              <div className="space-y-3">
                {strainsNeedingReminder.map(strain => {
                  const lastTransfer = strain.transferReminder?.lastTransferDate 
                    ? new Date(strain.transferReminder.lastTransferDate)
                    : new Date(strain.addedAt);
                  const daysSince = Math.floor((new Date().getTime() - lastTransfer.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={strain.id} className="p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-700">
                      <h3 className="font-medium text-secondary-900 dark:text-secondary-100">{strain.name}</h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        距离上次转接已过 {daysSince} 天
                      </p>
                      <p className="text-xs text-warning-600 dark:text-warning-400">
                        建议间隔：{strain.transferReminder?.intervalDays} 天
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-6 border-t border-secondary-200 dark:border-secondary-700">
              <button
                onClick={() => setShowReminders(false)}
                className="w-full btn-primary"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrainsList;