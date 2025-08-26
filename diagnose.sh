#!/bin/bash

echo "=== 诊断上传问题 ==="
echo ""

echo "1. 检查项目目录权限："
ls -la /Users/liuboheng/Documents/zpm/prompt-combiner/

echo ""
echo "2. 检查 public 目录权限："
ls -la /Users/liuboheng/Documents/zpm/prompt-combiner/public/

echo ""
echo "3. 检查 uploads 目录权限："
ls -la /Users/liuboheng/Documents/zpm/prompt-combiner/public/uploads/

echo ""
echo "4. 检查 data 目录权限："
ls -la /Users/liuboheng/Documents/zpm/prompt-combiner/data/

echo ""
echo "5. 检查数据库文件权限："
ls -la /Users/liuboheng/Documents/zpm/prompt-combiner/data/posts.db

echo ""
echo "6. 测试写入权限（创建临时文件）："
touch /Users/liuboheng/Documents/zpm/prompt-combiner/public/uploads/test_write.tmp && echo "✅ uploads目录写入正常" || echo "❌ uploads目录写入失败"
rm -f /Users/liuboheng/Documents/zpm/prompt-combiner/public/uploads/test_write.tmp

echo ""
echo "7. 检查Node.js进程："
ps aux | grep -i next

echo ""
echo "8. 检查端口占用："
lsof -i :3000 || echo "端口3000未被占用"

echo ""
echo "诊断完成！"
