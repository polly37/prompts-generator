# GitHub Pages 部署配置

## 自动部署步骤

### 1. 在GitHub网站上创建工作流文件

1. 访问您的仓库：https://github.com/polly37/prompts-generator
2. 点击"Actions"标签页
3. 点击"set up a workflow yourself"或"New workflow"
4. 将下面的内容复制到编辑器中：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Install dependencies
        run: npm ci
      
      - name: Build with Next.js
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. 文件名设置为：`.github/workflows/deploy.yml`
6. 点击"Commit changes"

### 2. 启用GitHub Pages

1. 在仓库中点击"Settings"标签页
2. 左侧找到"Pages"
3. 在"Source"下拉菜单中选择"GitHub Actions"
4. 保存设置

### 3. 部署URL

部署完成后，您的网站将可通过以下URL访问：
https://polly37.github.io/prompts-generator

## 手动部署方式（备选）

如果GitHub Actions遇到问题，您也可以选择手动部署：

1. 本地构建：`npm run build`
2. 将`out`文件夹的内容上传到`gh-pages`分支
3. 在GitHub Pages设置中选择`gh-pages`分支作为源

## 注意事项

- 确保`next.config.ts`中已设置`output: 'export'`（已完成）
- 确保`images.unoptimized: true`（已完成）
- 每次推送代码到main分支都会自动部署
- 首次部署可能需要5-10分钟

## 故障排除

如果部署失败：
1. 检查GitHub Actions日志
2. 确保所有依赖项都在package.json中
3. 检查构建命令是否正确
