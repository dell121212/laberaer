/*
  # 添加管理员账户

  1. 创建管理员用户
    - 用户名: admin
    - 密码: admin
    - 邮箱: admin@sgxy.edu.cn
    - 角色: admin

  2. 安全设置
    - 确保管理员账户不被阻止
    - 设置创建时间
*/

-- 插入管理员账户（如果不存在）
INSERT INTO users (
  username,
  email,
  password,
  role,
  is_blocked,
  created_at
) VALUES (
  'admin',
  'admin@sgxy.edu.cn',
  'admin',
  'admin',
  false,
  now()
) ON CONFLICT (username) DO NOTHING;

-- 确保管理员账户邮箱唯一性
INSERT INTO users (
  username,
  email,
  password,
  role,
  is_blocked,
  created_at
) VALUES (
  'admin',
  'admin@sgxy.edu.cn',
  'admin',
  'admin',
  false,
  now()
) ON CONFLICT (email) DO NOTHING;