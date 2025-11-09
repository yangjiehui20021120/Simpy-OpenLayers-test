#!/bin/bash

echo "========================================"
echo "  推送到GitHub"
echo "========================================"
echo ""
echo "请输入您的GitHub用户名："
read -r USERNAME

echo ""
echo "请输入您的GitHub个人访问令牌（PAT）："
echo "（不是密码！需要在 https://github.com/settings/tokens 生成）"
read -r -s TOKEN

echo ""
echo "正在推送..."

# 构建带认证的URL
git push https://${USERNAME}:${TOKEN}@github.com/chaolaikeji2025-svg/Simpy-OpenLayers-test.git main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo "查看：https://github.com/chaolaikeji2025-svg/Simpy-OpenLayers-test"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "1. 用户名是否正确"
    echo "2. 令牌是否有效且具有 repo 权限"
    echo "3. 网络连接是否正常"
fi

