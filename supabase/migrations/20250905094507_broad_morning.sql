/*
  # 添加初始管理员账户

  1. 新增管理员用户
    - 用户名: admin
    - 密码: admin
    - 邮箱: admin@sgxy.edu.cn
    - 角色: admin

  2. 安全设置
    - 确保管理员账户不被重复创建
    - 设置默认创建时间
*/

-- 添加初始管理员账户（如果不存在）
INSERT INTO users (
  id,
  username,
  email,
  password,
  role,
  is_blocked,
  created_at
) 
SELECT 
  gen_random_uuid(),
  'admin',
  'admin@sgxy.edu.cn',
  'admin',
  'admin',
  false,
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE username = 'admin'
);