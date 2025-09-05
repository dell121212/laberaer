/*
  # 修复管理员用户创建

  1. 删除可能存在的重复用户
  2. 重新创建管理员用户
  3. 确保数据正确性
*/

-- 删除可能存在的admin用户（如果存在）
DELETE FROM users WHERE username = 'admin' OR email = 'admin@sgxy.edu.cn';

-- 重新创建管理员用户
INSERT INTO users (
  id,
  username, 
  email, 
  password, 
  role, 
  is_blocked,
  created_at
) VALUES (
  gen_random_uuid(),
  'admin',
  'admin@sgxy.edu.cn',
  'admin',
  'admin',
  false,
  now()
);

-- 验证创建结果
SELECT 
  id,
  username,
  email,
  password,
  role,
  is_blocked,
  created_at
FROM users 
WHERE username = 'admin';