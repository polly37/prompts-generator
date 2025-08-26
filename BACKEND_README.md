# 后端功能说明

## 功能概述

现在你的 AI 提示词组合器已经集成了完整的后端功能，支持：

- ✅ 图片上传和存储
- ✅ 提示词与图片关联保存
- ✅ 数据持久化（SQLite 数据库）
- ✅ 多用户分享功能
- ✅ 图片预览和放大
- ✅ 实时更新社区内容

## 技术架构

### 后端 API 路由
- `POST /api/upload` - 上传图片和提示词
- `GET /api/posts` - 获取所有分享的帖子
- `DELETE /api/posts/[id]` - 删除指定帖子

### 数据存储
- **数据库**: SQLite (`data/posts.db`)
- **图片存储**: 本地文件系统 (`public/uploads/`)
- **数据结构**:
  ```sql
  CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    imageUrl TEXT NOT NULL,
    imagePath TEXT NOT NULL,
    prompt TEXT NOT NULL,
    userName TEXT NOT NULL,
    uploadTime TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
  ```

### 文件结构
```
src/
├── lib/
│   └── database.ts           # 数据库操作工具
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts      # 文件上传 API
│   │   └── posts/
│   │       ├── route.ts      # 获取帖子 API
│   │       └── [id]/
│   │           └── route.ts  # 删除帖子 API
│   └── page.tsx             # 前端主页面
data/
└── posts.db                 # SQLite 数据库文件
public/
└── uploads/                 # 用户上传的图片存储目录
```

## 使用方法

### 1. 启动应用
```bash
npm run dev
```

### 2. 功能使用流程
1. **输入昵称**: 在"你的昵称"字段输入用户名
2. **选择图片**: 点击上传区域选择图片文件
3. **输入提示词**: 在提示词框内输入生成该图片的 AI 提示词
4. **分享到社区**: 点击"分享到社区"按钮上传

### 3. 社区功能
- 查看其他用户分享的图片和提示词
- 点击图片可以放大预览
- 复制其他用户的提示词
- 管理员可以清空所有内容（演示功能）

## 数据持久化

- ✅ **图片文件**: 永久保存在 `public/uploads/` 目录
- ✅ **数据库记录**: 永久保存在 SQLite 数据库中
- ✅ **跨会话持续**: 关闭浏览器重新打开后数据仍在
- ✅ **多用户共享**: 不同用户可以看到彼此分享的内容

## 生产环境部署建议

### 1. 数据库升级
考虑升级到 PostgreSQL 或 MySQL：
```bash
npm install pg @types/pg
# 或
npm install mysql2 @types/mysql2
```

### 2. 云存储
建议使用云存储服务（如 AWS S3、阿里云 OSS）：
```bash
npm install @aws-sdk/client-s3
```

### 3. 图片处理
添加图片压缩和格式转换：
```bash
npm install sharp
```

### 4. 安全增强
- 添加文件类型验证
- 实现用户认证
- 添加内容审核
- 设置上传限制

### 5. 缓存优化
```bash
npm install redis @types/redis
```

## 环境配置

在 `.env.local` 文件中配置：
```
DATABASE_PATH=./data/posts.db
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=5242880
```

## 故障排除

### 1. 上传失败
- 检查 `public/uploads` 目录是否存在且有写权限
- 确认文件大小不超过限制（默认 5MB）

### 2. 数据库错误
- 检查 `data` 目录是否存在
- 确认有数据库文件写权限

### 3. 图片显示问题
- 确认图片文件路径正确
- 检查 Next.js 静态文件服务配置

## 开发测试

应用现在运行在: http://localhost:3003

你可以：
1. 上传测试图片
2. 输入提示词分享
3. 查看是否持久化保存
4. 关闭浏览器重新打开测试数据是否仍在
