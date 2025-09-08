/*
  # 为培养基表添加保藏温度和时间字段

  1. 更新说明
    - 为 media 表的 cultivation_params 字段添加保藏温度和时间参数
    - 这些字段将存储在现有的 JSONB 字段中，无需修改表结构
    - 更新现有记录以包含新的字段结构

  2. 字段说明
    - storage_temperature: 保藏温度（如：4°C、-20°C）
    - storage_time: 保藏时间（如：6个月、1年）
*/

-- 更新现有记录，为 cultivation_params 添加新字段
UPDATE media 
SET cultivation_params = cultivation_params || 
  jsonb_build_object(
    'storage_temperature', '',
    'storage_time', ''
  )
WHERE cultivation_params IS NOT NULL;

-- 为没有 cultivation_params 的记录设置默认值
UPDATE media 
SET cultivation_params = jsonb_build_object(
  'temperature', '',
  'time', '',
  'ph', '',
  'other', '',
  'storage_temperature', '',
  'storage_time', ''
)
WHERE cultivation_params IS NULL;