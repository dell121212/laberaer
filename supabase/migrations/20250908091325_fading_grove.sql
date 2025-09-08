/*
  # 创建默认管理员用户

  1. 新增数据
    - 创建默认管理员账户 (admin/admin123)
    - 设置管理员权限
  
  2. 安全设置
    - 确保管理员账户存在
    - 设置正确的角色权限
*/

-- 插入默认管理员用户（如果不存在）
INSERT INTO users (username, email, password, role, is_blocked)
SELECT 'admin', 'admin@sgxy.edu.cn', 'admin123', 'admin', false
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE username = 'admin'
);

-- 确保管理员用户的角色正确
UPDATE users 
SET role = 'admin', is_blocked = false 
WHERE username = 'admin';