/*
  # 创建用户注册函数

  1. 创建 RPC 函数
    - `create_user` 函数用于绕过 RLS 创建用户
    - 确保管理员账户存在
  
  2. 权限设置
    - 允许匿名用户调用注册函数
    - 函数内部使用 SECURITY DEFINER 权限
*/

-- 创建用户注册函数
CREATE OR REPLACE FUNCTION create_user(
  p_username TEXT,
  p_email TEXT,
  p_password TEXT,
  p_role TEXT DEFAULT 'member'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- 插入新用户
  INSERT INTO users (username, email, password, role)
  VALUES (p_username, p_email, p_password, p_role)
  RETURNING id INTO new_user_id;
  
  -- 返回成功结果
  SELECT json_build_object(
    'success', true,
    'user_id', new_user_id,
    'message', '用户创建成功'
  ) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN unique_violation THEN
    -- 处理唯一约束违反
    SELECT json_build_object(
      'success', false,
      'message', '用户名或邮箱已存在'
    ) INTO result;
    RETURN result;
  WHEN OTHERS THEN
    -- 处理其他错误
    SELECT json_build_object(
      'success', false,
      'message', '创建用户失败: ' || SQLERRM
    ) INTO result;
    RETURN result;
END;
$$;

-- 授权匿名用户调用此函数
GRANT EXECUTE ON FUNCTION create_user TO anon;
GRANT EXECUTE ON FUNCTION create_user TO authenticated;

-- 确保管理员账户存在
DO $$
BEGIN
  -- 检查管理员是否存在
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin') THEN
    -- 创建管理员账户
    INSERT INTO users (username, email, password, role, is_blocked)
    VALUES ('admin', 'admin@sgxy.edu.cn', 'admin', 'admin', false);
    
    RAISE NOTICE '管理员账户创建成功';
  ELSE
    RAISE NOTICE '管理员账户已存在';
  END IF;
END $$;