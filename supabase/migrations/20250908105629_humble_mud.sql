/*
  # 修复菌种表插入权限策略

  1. 问题描述
    - 认证用户无法向 strains 表插入数据
    - RLS 策略阻止了 INSERT 操作

  2. 解决方案
    - 删除可能有问题的现有 INSERT 策略
    - 创建新的允许认证用户插入的策略
    - 确保策略条件正确设置

  3. 安全性
    - 只允许认证用户插入数据
    - 保持数据访问的安全性
*/

-- 删除可能存在的有问题的插入策略
DROP POLICY IF EXISTS "Allow authenticated users to insert strains" ON strains;
DROP POLICY IF EXISTS "Enable insert for authenticated users on strains" ON strains;

-- 创建新的插入策略，允许所有认证用户插入菌种数据
CREATE POLICY "Allow authenticated users to insert strains"
  ON strains
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 确保 RLS 已启用
ALTER TABLE strains ENABLE ROW LEVEL SECURITY;