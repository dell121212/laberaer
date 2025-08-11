import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../../components/Common/SearchBar';
import FloatingActionButton from '../../components/Common/FloatingActionButton';
import ImportExportButtons from '../../components/Common/ImportExportButtons';
import ThesisForm from './ThesisForm';
import ThesisDetail from './ThesisDetail';
import { GraduationCap, Download, Upload, FileText } from 'lucide-react';
import { format } from 'date-fns';

const ThesesList: React.FC = () => {
  const { theses, exportData, downloadTemplate } = useApp();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingThesis, setEditingThesis] = useState(null);
  const [selectedThesis, setSelectedThesis] = useState(null);

  const filteredTheses = theses.filter(thesis =>
    thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thesis.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thesis.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thesis.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddThesis = () => {
    setEditingThesis(null);
    setShowForm(true);
  };

  const handleEditThesis = (thesis: any) => {
    setEditingThesis(thesis);
    setShowForm(true);
  };

  const handleExport = () => {
    exportData('theses');
  };

  const handleDownloadTemplate = () => {
    downloadTemplate('theses');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GraduationCap size={24} />
              <h1 className="text-xl font-bold">历届毕业论文</h1>
            </div>
            <div className="flex gap-2">
              <ImportExportButtons module="theses" />
            </div>
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索论文题目、作者、年级或班级..."
          />
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="modern-card p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-secondary-900">{filteredTheses.length}</p>
              <p className="text-secondary-600">论文总数</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-secondary-600">最新论文</p>
              <p className="font-medium text-secondary-800">
                {theses.length > 0 ? 
                  theses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].title.slice(0, 10) + '...' :
                  '暂无数据'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Theses List */}
        <div className="space-y-3">
          {filteredTheses.map((thesis, index) => (
            <div 
              key={thesis.id} 
              className="modern-card p-4 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedThesis(thesis)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <FileText size={16} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900 mb-1 line-clamp-2">
                    {thesis.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-secondary-600 mb-2">
                    <span>作者：{thesis.author}</span>
                    <span>{thesis.grade} {thesis.class}</span>
                  </div>
                  <p className="text-xs text-secondary-500">
                    {format(new Date(thesis.createdAt), 'yyyy年MM月dd日')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTheses.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap size={48} className="mx-auto text-secondary-300 mb-4" />
            <p className="text-secondary-500">暂无毕业论文数据</p>
            <p className="text-secondary-400 text-sm">点击右下角按钮添加论文</p>
          </div>
        )}
      </div>

      <FloatingActionButton onClick={handleAddThesis} />

      {showForm && (
        <ThesisForm
          thesis={editingThesis}
          onClose={() => setShowForm(false)}
        />
      )}

      {selectedThesis && (
        <ThesisDetail
          thesis={selectedThesis}
          onClose={() => setSelectedThesis(null)}
          onEdit={handleEditThesis}
        />
      )}
    </div>
  );
};

export default ThesesList;