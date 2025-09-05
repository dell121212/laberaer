# 韶关学院食用菌创新团队管理系统

一个现代化的实验室管理系统，用于管理菌种保藏、成员信息、值日安排、培养基推荐和毕业论文等数据。

## 功能特性

### 🔐 用户认证系统
- **邮箱验证注册**：支持真实邮箱验证码注册
- **安全登录**：用户名密码登录
- **权限管理**：管理员和普通成员权限分离
- **数据安全**：所有数据存储在云端，支持多设备同步

### 📊 数据管理模块
- **菌种保藏**：完整的菌种信息管理
- **成员名单**：团队成员信息维护
- **值日安排**：实验室卫生值日计划
- **培养基推荐**：培养基配方和参数管理
- **毕业论文**：历届论文资料存档
- **操作记录**：完整的用户操作日志

### 💾 数据持久化
- **云端存储**：基于Supabase的实时数据库
- **数据同步**：多设备实时数据同步
- **备份安全**：自动备份，数据永不丢失
- **导入导出**：支持Excel格式数据导入导出

### 🎨 用户体验
- **响应式设计**：完美适配手机、平板、电脑
- **深色模式**：支持明暗主题切换
- **现代UI**：Material Design风格界面
- **流畅动画**：丰富的交互动画效果

## 技术栈

- **前端框架**：React 18 + TypeScript
- **UI框架**：Tailwind CSS
- **路由管理**：React Router v6
- **状态管理**：React Context API
- **数据库**：Supabase (PostgreSQL)
- **邮件服务**：EmailJS
- **构建工具**：Vite
- **部署平台**：Netlify

## 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 环境配置
1. 创建 `.env` 文件
2. 配置Supabase连接信息：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 邮件服务配置
邮件服务已配置完成，使用EmailJS发送真实验证码：
- **Service ID**: service_ov4ajko
- **Public Key**: dM_PUilQ-JgdKdyAP
- **Template**: 需要在EmailJS控制台创建邮件模板

**邮件模板变量**：
- `{{to_name}}` - 收件人姓名
- `{{verification_code}}` - 验证码
- `{{from_name}}` - 发件人名称
- `{{message}}` - 邮件内容

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 默认账户

系统预设管理员账户：
- **用户名**：admin
- **密码**：admin
- **邮箱**：admin@sgxy.edu.cn

## 权限说明

### 管理员权限
- ✅ 查看所有数据
- ✅ 添加、编辑、删除所有数据
- ✅ 用户管理
- ✅ 系统设置
- ✅ 操作日志查看

### 普通成员权限
- ✅ 查看所有数据
- ✅ 添加、编辑数据
- ✅ 导出数据
- ❌ 删除数据
- ❌ 用户管理

## 数据结构

### 用户表 (users)
- id: 用户ID
- username: 用户名
- email: 邮箱
- role: 角色 (admin/member)
- created_at: 创建时间

### 菌种表 (strains)
- id: 菌种ID
- name: 菌种名称
- scientific_name: 学名
- type: 类型
- source: 来源
- preservation_method: 保藏方法
- preservation_temperature: 保藏温度
- location: 保藏位置
- description: 描述
- added_by: 添加人
- added_at: 添加时间

### 成员表 (members)
- id: 成员ID
- name: 姓名
- group: 组别
- phone: 电话
- grade: 年级
- class: 班级
- thesis_content: 毕设内容
- other_info: 其他信息
- joined_at: 加入时间

### 值日表 (duty_schedules)
- id: 值日ID
- date: 值日日期
- members: 值日人员
- tasks: 值日任务
- status: 状态
- notes: 备注
- created_at: 创建时间

### 培养基表 (media)
- id: 培养基ID
- name: 名称
- type: 类型 (liquid/solid)
- suitable_strains: 适用菌种
- formula: 配方
- cultivation_params: 培养参数
- recommended_by: 推荐人
- created_at: 创建时间

### 论文表 (theses)
- id: 论文ID
- title: 标题
- author: 作者
- grade: 年级
- class: 班级
- other_content: 其他内容
- created_at: 创建时间

### 操作日志表 (activity_logs)
- id: 日志ID
- user_id: 用户ID
- username: 用户名
- action: 操作
- module: 模块
- details: 详情
- timestamp: 时间戳

## 部署说明

### Netlify部署
1. 连接GitHub仓库
2. 设置构建命令：`npm run build`
3. 设置发布目录：`dist`
4. 配置环境变量

### 自定义域名
支持绑定自定义域名，详见Netlify文档。

## 开发团队

- **开发者**：陈凯
- **指导老师**：刘主
- **单位**：韶关学院食用菌创新团队

## 许可证

MIT License

## 更新日志

### v2.0.0 (2024-12-XX)
- ✨ 新增真实邮箱验证码功能
- ✨ 实现Supabase云端数据存储
- ✨ 支持多设备数据同步
- 🐛 修复权限管理问题
- 🎨 优化用户界面体验

### v1.0.0 (2024-11-XX)
- 🎉 初始版本发布
- ✨ 基础功能模块完成
- 🎨 响应式设计实现

## 技术支持

如有问题或建议，请联系开发团队。

---

**韶关学院食用菌创新团队** © 2024