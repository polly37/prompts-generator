# 部署指南

## 🚀 推荐的部署方式

### 1. Vercel部署（最推荐）✨

**优点**：
- Next.js官方平台，性能最佳
- 自动CI/CD，推送代码即部署
- 免费额度充足
- 全球CDN加速

**步骤**：
1. 将代码推送到GitHub仓库
2. 访问 [vercel.com](https://vercel.com) 注册账号
3. 点击"New Project"，连接GitHub仓库
4. 选择项目，Vercel会自动检测Next.js配置
5. 点击Deploy，几分钟后即可访问

**配置文件**：`vercel.json` 已准备好

---

### 2. Netlify部署

**优点**：
- 免费且功能丰富
- 支持表单处理和函数
- 自动SSL证书

**步骤**：
1. 访问 [netlify.com](https://netlify.com) 注册
2. 点击"New site from Git"
3. 连接GitHub仓库
4. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `out`

---

### 3. GitHub Pages部署

**优点**：
- 完全免费
- 与GitHub深度集成

**步骤**：
1. 推送代码到GitHub
2. 在仓库设置中启用GitHub Pages
3. 选择"GitHub Actions"作为部署源
4. GitHub Actions工作流已配置在 `.github/workflows/deploy.yml`

**URL格式**：`https://yourusername.github.io/repositoryname`

---

### 4. 其他平台

#### Railway
- 访问 [railway.app](https://railway.app)
- 连接GitHub，自动部署

#### Render
- 访问 [render.com](https://render.com)
- 创建Static Site，连接仓库

## 📋 部署前检查

✅ 项目已清理不需要的依赖  
✅ 配置文件已优化  
✅ 构建测试通过  
✅ 静态导出配置完成  

## 🛠 本地测试部署版本

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📝 注意事项

1. **图片优化**：已设置 `images.unoptimized: true` 支持静态部署
2. **路由配置**：设置了 `trailingSlash: true` 确保静态部署兼容性
3. **环境变量**：如需环境变量，在部署平台设置界面添加

## 🎯 推荐选择

- **个人项目**：GitHub Pages（免费）
- **商业项目**：Vercel（性能最佳）
- **需要后端功能**：Netlify（支持Functions）
