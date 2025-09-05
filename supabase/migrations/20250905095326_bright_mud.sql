/*
  # 创建管理员用户

  1. 创建管理员账户
    - 用户名: admin
    - 密码: admin
    - 邮箱: admin@sgxy.edu.cn
    - 角色: admin
  
  2. 确保不会重复创建
    - 使用 ON CONFLICT DO NOTHING
*/

-- 首先检查并创建管理员用户
DO $$
BEGIN
  -- 检查是否已存在管理员用户
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin') THEN
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
    
    RAISE NOTICE '管理员账户创建成功';
  ELSE
    RAISE NOTICE '管理员账户已存在';
  END IF;
END $$;