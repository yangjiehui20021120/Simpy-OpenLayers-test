# 🚀 启动服务器指南

## ✅ 依赖已安装

- ✅ Python 后端依赖已安装
- ✅ Node.js 前端依赖已安装 (75个包)
- ✅ Python 版本: 3.12.4
- ✅ Node.js 版本: v24.11.1
- ✅ npm 版本: 11.6.2

## 📝 启动步骤

### 方式1：使用两个终端窗口（推荐）

#### 终端1 - 启动后端服务器

```powershell
cd D:\workspace\works\cursor\Simpy-OpenLayers-test\backend
python server.py
```

等待看到：
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

#### 终端2 - 启动前端开发服务器

打开新的终端窗口，运行：

```powershell
cd D:\workspace\works\cursor\Simpy-OpenLayers-test\frontend-vue
npm run dev
```

等待看到：
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 方式2：使用启动脚本

#### Windows批处理文件

在项目根目录创建 `start-all.bat`:

```batch
@echo off
start "Backend Server" cmd /k "cd backend && python server.py"
timeout /t 3
start "Frontend Dev Server" cmd /k "cd frontend-vue && npm run dev"
echo.
echo 服务器正在启动...
echo.
echo 后端: http://localhost:8000
echo 前端: http://localhost:5173
echo.
```

然后双击运行 `start-all.bat`

#### PowerShell脚本

创建 `start-all.ps1`:

```powershell
# 启动后端
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python server.py"

# 等待3秒
Start-Sleep -Seconds 3

# 启动前端  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-vue; npm run dev"

Write-Host "服务器正在启动..." -ForegroundColor Green
Write-Host ""
Write-Host "后端: http://localhost:8000" -ForegroundColor Cyan
Write-Host "前端: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "按任意键继续..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
```

运行：
```powershell
powershell -ExecutionPolicy Bypass -File start-all.ps1
```

## 🌐 访问地址

启动成功后：

- **前端界面**: http://localhost:5173
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs

## ✅ 验证服务器状态

### 检查后端

打开浏览器访问：http://localhost:8000/api/simulation/status

应该看到JSON响应：
```json
{
  "running": false,
  "statistics": null
}
```

### 检查前端

打开浏览器访问：http://localhost:5173

应该看到完整的仿真界面。

## 🛑 停止服务器

在各自的终端窗口中按 `Ctrl+C`

## ❓ 常见问题

### 端口被占用

如果看到 "Address already in use" 错误：

**检查并关闭占用端口的进程：**

```powershell
# 检查8000端口
netstat -ano | findstr "8000"

# 检查5173端口  
netstat -ano | findstr "5173"

# 关闭进程 (PID是上面命令显示的进程ID)
taskkill /PID <进程ID> /F
```

### Python模块未找到

重新安装依赖：
```powershell
cd backend
pip install -r ../requirements.txt
```

### npm包错误

清除并重新安装：
```powershell
cd frontend-vue
rm -r node_modules
npm install
```

## 📊 系统资源

运行中的进程：
- Python (server.py) - 约50-100MB内存
- Node.js (Vite) - 约100-200MB内存

总内存占用：约150-300MB

---

**创建时间**: 2024
**所有依赖已安装完成** ✅

