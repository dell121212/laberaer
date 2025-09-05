/*
  # 韶关学院食用菌创新团队数据库架构

  1. 新建表
    - `users` - 用户表
    - `strains` - 菌种保藏表
    - `members` - 成员名单表
    - `duty_schedules` - 值日安排表
    - `media` - 培养基推荐表
    - `theses` - 毕业论文表
    - `activity_logs` - 操作记录表

  2. 安全设置
    - 为所有表启用行级安全 (RLS)
    - 添加适当的策略以确保数据安全

  3. 默认数据
    - 创建默认管理员账户
*/

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  is_blocked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 菌种保藏表
CREATE TABLE IF NOT EXISTS strains (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  scientific_name text NOT NULL,
  type text NOT NULL,
  description text DEFAULT '',
  source text NOT NULL,
  preservation_method text NOT NULL,
  preservation_temperature text NOT NULL,
  location text NOT NULL,
  added_by text NOT NULL,
  added_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 成员名单表
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  "group" text NOT NULL,
  phone text NOT NULL,
  grade text,
  class text,
  thesis_content text,
  other_info text,
  joined_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 值日安排表
CREATE TABLE IF NOT EXISTS duty_schedules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date text NOT NULL,
  members text[] NOT NULL,
  tasks text[] NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 培养基推荐表
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'solid' CHECK (type IN ('liquid', 'solid')),
  suitable_strains text[] NOT NULL,
  formula text NOT NULL,
  cultivation_params jsonb DEFAULT '{"temperature":"","time":"","ph":"","other":""}',
  recommended_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 毕业论文表
CREATE TABLE IF NOT EXISTS theses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  author text NOT NULL,
  grade text NOT NULL,
  class text NOT NULL,
  other_content text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 操作记录表
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id text NOT NULL,
  username text NOT NULL,
  action text NOT NULL,
  module text NOT NULL,
  details text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- 启用行级安全
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE strains ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE duty_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE theses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "用户可以查看所有用户信息"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "用户可以更新自己的信息"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "管理员可以管理所有用户"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- 菌种保藏表策略
CREATE POLICY "所有认证用户可以查看菌种"
  ON strains
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "所有认证用户可以添加菌种"
  ON strains
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "所有认证用户可以更新菌种"
  ON strains
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "只有管理员可以删除菌种"
  ON strains
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- 成员名单表策略
CREATE POLICY "所有认证用户可以查看成员"
  ON members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "所有认证用户可以添加成员"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "所有认证用户可以更新成员"
  ON members
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "只有管理员可以删除成员"
  ON members
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- 值日安排表策略
CREATE POLICY "所有认证用户可以查看值日安排"
  ON duty_schedules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "所有认证用户可以添加值日安排"
  ON duty_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "所有认证用户可以更新值日安排"
  ON duty_schedules
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "只有管理员可以删除值日安排"
  ON duty_schedules
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- 培养基推荐表策略
CREATE POLICY "所有认证用户可以查看培养基"
  ON media
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "所有认证用户可以添加培养基"
  ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "所有认证用户可以更新培养基"
  ON media
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "只有管理员可以删除培养基"
  ON media
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- 毕业论文表策略
CREATE POLICY "所有认证用户可以查看论文"
  ON theses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "所有认证用户可以添加论文"
  ON theses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "所有认证用户可以更新论文"
  ON theses
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "只有管理员可以删除论文"
  ON theses
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- 操作记录表策略
CREATE POLICY "所有认证用户可以查看操作记录"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "所有认证用户可以添加操作记录"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 插入默认管理员账户
INSERT INTO users (id, username, email, password, role, created_at)
VALUES (
  uuid_generate_v4(), 
  'admin', 
  'admin@sgxy.edu.cn', 
  'admin', 
  'admin', 
  now()
)
ON CONFLICT (username) DO NOTHING;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_strains_name ON strains(name);
CREATE INDEX IF NOT EXISTS idx_strains_type ON strains(type);
CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
CREATE INDEX IF NOT EXISTS idx_members_group ON members("group");
CREATE INDEX IF NOT EXISTS idx_duty_schedules_date ON duty_schedules(date);
CREATE INDEX IF NOT EXISTS idx_media_name ON media(name);
CREATE INDEX IF NOT EXISTS idx_theses_author ON theses(author);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);