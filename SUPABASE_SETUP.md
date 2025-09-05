# Supabase 项目设置指南

## 🚀 快速设置步骤

### 1. 创建 Supabase 项目
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 选择组织或创建新组织
4. 填写项目信息：
   - **项目名称**: `sgxy-mushroom-team`
   - **数据库密码**: 设置一个强密码（请记住）
   - **地区**: 选择 `Southeast Asia (Singapore)` 或最近的地区

### 2. 获取项目配置信息
项目创建完成后，在项目设置中找到：

1. **Project URL**: `https://your-project-ref.supabase.co`
2. **API Keys** → **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. 更新环境变量
将获取的信息填入 `.env` 文件：

```env
# Supabase配置
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# EmailJS配置
VITE_EMAILJS_SERVICE_ID=service_ov4ajko
VITE_EMAILJS_TEMPLATE_ID=template_verification
VITE_EMAILJS_PUBLIC_KEY=dM_PUilQ-JgdKdyAP
```

### 4. 运行数据库迁移
在 Supabase Dashboard 中：

1. 进入 **SQL Editor**
2. 点击 **New Query**
3. 复制 `supabase/migrations/create_sgxy_schema.sql` 的内容
4. 粘贴到查询编辑器中
5. 点击 **Run** 执行

### 5. 启用认证功能
在 Supabase Dashboard 中：

1. 进入 **Authentication** → **Settings**
2. 在 **Site URL** 中添加：
   - `http://localhost:5173` (开发环境)
   - `https://sgxy.netlify.app` (生产环境)
3. 在 **Auth** → **Providers** 中：
   - 确保 **Email** 提供商已启用
   - 关闭 **Confirm email** (因为我们使用自定义验证)

## 🔧 数据库结构

### 核心表结构
- **users**: 用户账户信息
- **strains**: 菌种保藏数据
- **members**: 团队成员信息
- **duty_schedules**: 值日安排
- **media**: 培养基推荐
- **theses**: 毕业论文资料
- **activity_logs**: 操作日志

### 权限设置
- **管理员**: 完全访问权限，可以删除数据
- **普通成员**: 查看、添加、编辑权限，无删除权限
- **行级安全**: 确保数据安全访问

## 🔐 默认账户

系统会自动创建管理员账户：
- **用户名**: `admin`
- **密码**: `admin`
- **邮箱**: `admin@sgxy.edu.cn`

## ✅ 验证设置

设置完成后，重启开发服务器：

```bash
npm run dev
```

如果配置正确，您应该能够：
1. 使用管理员账户登录
2. 看到空的数据列表
3. 添加新数据并在数据库中看到
4. 在不同设备上登录看到相同数据

## 🚨 故障排除

### 常见问题

1. **连接错误**: 检查 URL 和 API Key 是否正确
2. **权限错误**: 确保 RLS 策略已正确设置
3. **认证失败**: 检查 Site URL 配置

### 调试步骤

1. 打开浏览器开发者工具
2. 查看 Console 中的错误信息
3. 检查 Network 标签中的 API 请求
4. 在 Supabase Dashboard 中查看日志

## 📊 监控和维护

### 数据库监控
- 在 Supabase Dashboard 中查看 **Database** → **Logs**
- 监控 API 使用情况
- 定期备份重要数据

### 性能优化
- 数据库已创建必要索引
- 使用 RLS 确保查询效率
- 定期清理过期日志数据

---

**设置完成后，您的应用将拥有：**
- ✅ 云端数据存储
- ✅ 跨设备数据同步
- ✅ 用户认证系统
- ✅ 权限管理
- ✅ 数据安全保护
- ✅ 实时数据更新