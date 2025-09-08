/*
  # 修复菌种表的行级安全策略

  1. 问题描述
    - 用户无法添加菌种数据
    - 出现 "new row violates row-level security policy" 错误
    - 401 未授权状态码

  2. 解决方案
    - 删除可能有问题的现有 INSERT 策略
    - 创建新的 INSERT 策略允许所有认证用户添加数据
    - 确保策略配置正确

  3. 安全性
    - 仅允许认证用户插入数据
    - 保持其他操作的安全策略不变
*/

-- 删除可能存在问题的现有 INSERT 策略
DROP POLICY IF EXISTS "Enable insert for authenticated users on strains" ON strains;

-- 创建新的 INSERT 策略，允许所有认证用户添加菌种
CREATE POLICY "Allow authenticated users to insert strains"
  ON strains
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 确保表启用了 RLS
ALTER TABLE strains ENABLE ROW LEVEL SECURITY;