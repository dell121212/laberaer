/*
  # 修复行级安全策略权限问题

  1. 问题描述
    - 用户无法添加数据到各个表中
    - RLS 策略过于严格，阻止了正常的数据插入操作
    
  2. 解决方案
    - 重新创建所有表的 INSERT 策略
    - 确保认证用户可以正常添加数据
    - 保持安全性的同时允许正常操作
    
  3. 影响的表
    - strains (菌种)
    - members (成员)
    - duty_schedules (值日安排)
    - media (培养基)
    - theses (论文)
    - activity_logs (操作日志)
*/

-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "所有认证用户可以添加菌种" ON strains;
DROP POLICY IF EXISTS "所有认证用户可以添加成员" ON members;
DROP POLICY IF EXISTS "所有认证用户可以添加值日安排" ON duty_schedules;
DROP POLICY IF EXISTS "所有认证用户可以添加培养基" ON media;
DROP POLICY IF EXISTS "所有认证用户可以添加论文" ON theses;
DROP POLICY IF EXISTS "所有认证用户可以添加操作记录" ON activity_logs;

-- 为 strains 表创建正确的 INSERT 策略
CREATE POLICY "Enable insert for authenticated users on strains"
  ON strains
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 为 members 表创建正确的 INSERT 策略
CREATE POLICY "Enable insert for authenticated users on members"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 为 duty_schedules 表创建正确的 INSERT 策略
CREATE POLICY "Enable insert for authenticated users on duty_schedules"
  ON duty_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 为 media 表创建正确的 INSERT 策略
CREATE POLICY "Enable insert for authenticated users on media"
  ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 为 theses 表创建正确的 INSERT 策略
CREATE POLICY "Enable insert for authenticated users on theses"
  ON theses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 为 activity_logs 表创建正确的 INSERT 策略
CREATE POLICY "Enable insert for authenticated users on activity_logs"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 确保所有表都启用了 RLS
ALTER TABLE strains ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE duty_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE theses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;