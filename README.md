# 图书管理系统

一个基于 React 和 Supabase 构建的个人图书管理应用，帮助您轻松管理个人藏书。

## 功能特性

- ✅ 用户注册和登录
- ✅ 添加/编辑/删除图书信息
- ✅ 记录图书详情（标题、作者、ISBN、类型、出版日期等）
- ✅ 个人评分和读书笔记
- ✅ 阅读状态标记（已读/未读）
- ✅ 个人图书统计
- ✅ 响应式设计，支持多种设备

## 技术栈

- **前端**: React 18 + TypeScript
- **UI组件库**: Material-UI
- **状态管理**: React Hooks
- **后端**: Supabase (PostgreSQL, Auth, RLS)
- **表单处理**: React Hook Form

## 快速开始

### 环境要求

- Node.js 14+
- npm 或 yarn

### 安装步骤

1. 克隆项目：
```bash
git clone https://github.com/shenjler/book-manager.git
cd book-manager
```

2. 安装依赖：
```bash
npm install
```

3. 创建环境变量文件：
```bash
cp .env.example .env
```

4. 在 [Supabase](https://supabase.com) 创建项目并获取 API 信息，填入 `.env` 文件：
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. 启动开发服务器：
```bash
npm start
```

6. 应用将在 `http://localhost:3000` 启动

## 数据库结构

项目使用 Supabase PostgreSQL 数据库，主要包含以下表：

### books 表
| 字段 | 类型 | 描述 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户ID（外键） |
| title | TEXT | 书名（必填） |
| author | TEXT | 作者（必填） |
| isbn | TEXT | 国际标准书号 |
| genre | TEXT | 书籍类型 |
| publish_date | DATE | 出版日期 |
| publisher | TEXT | 出版社 |
| rating | SMALLINT | 评分（1-5星） |
| notes | TEXT | 读书笔记 |
| read_status | BOOLEAN | 阅读状态 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 许可证

MIT
