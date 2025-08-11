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
      // 清空文件输入
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
        className="p-2 rounded-lg hover:bg-white/20 transition-colors"
        title="下载模板"
      >
        <Download size={20} />
      </button>
      <button
        onClick={handleImportClick}
        className="p-2 rounded-lg hover:bg-white/20 transition-colors"
        title="导入数据"
      >
        <Upload size={20} />
      </button>
      <button
        onClick={handleExport}
        className="p-2 rounded-lg hover:bg-white/20 transition-colors"
        title="导出数据"
      >
        <Download size={20} />
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