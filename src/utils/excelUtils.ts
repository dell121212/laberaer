import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  try {
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(data);
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // 导出文件
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('导出Excel失败:', error);
    return false;
  }
};

export const importFromExcel = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 读取第一个工作表
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // 转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsArrayBuffer(file);
  });
};

export const downloadTemplate = (type: string) => {
  let templateData: any[] = [];
  let filename = '';
  
  switch (type) {
    case 'strains':
      templateData = [{
        name: '示例菌种',
        scientificName: 'Saccharomyces cerevisiae',
        type: '真菌',
        source: '实验室分离',
        preservationMethod: '冷冻保存',
        preservationTemperature: '-80°C',
        location: '冰箱A-1',
        description: '示例描述信息',
        addedBy: '张三'
      }];
      filename = '菌种保藏导入模板';
      break;
      
    case 'members':
      templateData = [{
        name: '张三',
        group: '功能组',
        phone: '13800138000',
        grade: '2023级',
        class: '生物技术1班',
        thesisContent: '食用菌多糖提取工艺优化研究',
        otherInfo: '擅长分子生物学实验'
      }];
      filename = '成员名单导入模板';
      break;
      
    case 'media':
      templateData = [{
        name: 'PDA培养基',
        suitableStrains: '平菇,香菇,金针菇',
        formula: '马铃薯200g，葡萄糖20g，琼脂15g，蒸馏水1000ml',
        recommendedBy: '李老师'
      }];
      filename = '培养基推荐导入模板';
      break;
      
    case 'theses':
      templateData = [{
        title: '食用菌多糖的提取及其生物活性研究',
        author: '王小明',
        grade: '2023级',
        class: '生物技术1班',
        otherContent: '指导老师：刘教授\n关键词：食用菌，多糖，生物活性\n摘要：本研究探讨了...'
      }];
      filename = '毕业论文导入模板';
      break;
  }
  
  exportToExcel(templateData, filename);
};