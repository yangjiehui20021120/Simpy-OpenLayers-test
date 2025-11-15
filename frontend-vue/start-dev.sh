#!/bin/bash

echo "============================================"
echo "  启动 Vue3 开发服务器"
echo "============================================"
echo ""

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

echo "✅ 依赖已安装"
echo ""
echo "🚀 启动开发服务器..."
echo ""
echo "访问地址: http://localhost:5173"
echo "后端地址: http://localhost:8000 (需要先启动后端服务)"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""
echo "============================================"
echo ""

npm run dev

