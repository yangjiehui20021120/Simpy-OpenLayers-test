@echo off
echo ============================================
echo   SimPy-OpenLayers Vue3 系统启动
echo ============================================
echo.
echo 正在启动服务器...
echo.

REM 启动后端服务器
echo [1/2] 启动后端服务器 (端口 8000)...
start "Backend - FastAPI Server" cmd /k "cd /d %~dp0backend && python server.py"

REM 等待3秒让后端启动
timeout /t 3 /nobreak > nul

REM 启动前端开发服务器
echo [2/2] 启动前端开发服务器 (端口 5173)...
start "Frontend - Vue3 Dev Server" cmd /k "cd /d %~dp0frontend-vue && npm run dev"

echo.
echo ============================================
echo   服务器启动完成！
echo ============================================
echo.
echo 请等待几秒钟让服务器完全启动...
echo.
echo 访问地址:
echo   前端界面: http://localhost:5173
echo   后端API:  http://localhost:8000
echo   API文档:  http://localhost:8000/docs
echo.
echo 按任意键打开浏览器...
pause > nul

REM 打开浏览器
start http://localhost:5173

echo.
echo 提示: 关闭服务器请在各自的窗口按 Ctrl+C
echo.

