import React, { useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Download, Upload } from 'lucide-react';

interface ImportExportButtonsProps {
  module: string;
  onImportSuccess?: () => void;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({ module, onImportSuccess }) => {
  const { exportData, importData, downloadTemplate } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportData(module);
  };

  const handleDownloadTemplate = () => {
    downloadTemplate(module);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(module, file);
      onImportSuccess?.();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      alert('导入失败，请检查文件格式');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDownloadTemplate}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="下载模板"
      >
        <Download size={18} className="text-gray-600" />
      </button>
      <button
        onClick={handleImportClick}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="导入数据"
      >
        <Upload size={18} className="text-gray-600" />
      </button>
      <button
        onClick={handleExport}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="导出数据"
      >
        <Download size={18} className="text-gray-600" />
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImportExportButtons;