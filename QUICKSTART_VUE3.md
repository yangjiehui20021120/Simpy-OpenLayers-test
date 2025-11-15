# 🚀 Vue3版本快速开始指南

本指南将帮助你快速启动Vue3版本的SimPy-OpenLayers系统。

## 系统要求

- Python 3.8+
- Node.js 16+ (推荐使用 LTS 版本)
- npm 或 yarn

## 一键启动（推荐）

### Windows系统

```bash
# 1. 启动后端（新终端窗口）
cd backend
python server.py

# 2. 启动前端（另一个新终端窗口）
cd frontend-vue
start-dev.bat
```

### Linux/Mac系统

```bash
# 1. 启动后端（新终端窗口）
cd backend
python3 server.py

# 2. 启动前端（另一个新终端窗口）
cd frontend-vue
./start-dev.sh
```

## 分步安装

### 第一步：安装后端依赖

```bash
# 安装 Python 依赖
pip install -r requirements.txt
```

### 第二步：安装前端依赖

```bash
cd frontend-vue
npm install
```

### 第三步：启动后端服务器

```bash
cd backend
python server.py
```

后端服务器将在 `http://localhost:8000` 运行

### 第四步：启动前端开发服务器

打开另一个终端窗口：

```bash
cd frontend-vue
npm run dev
```

前端开发服务器将在 `http://localhost:5173` 运行

## 访问系统

打开浏览器访问：**http://localhost:5173**

## 使用流程

### 1️⃣ 设置参数

在右侧控制面板设置仿真时长（默认100秒）

### 2️⃣ 开始仿真

点击 **"▶️ 开始仿真"** 按钮

### 3️⃣ 观察可视化

在地图上观察：
- 🔵 **蓝色圆点** - 移动的物料
- 🟢 **绿色圆圈** - 正在工作的设备
- ⚪ **灰色圆圈** - 空闲的设备
- 🟨 **黄色方块** - 缓冲区（显示库存）

### 4️⃣ 查看数据

右侧面板实时显示：
- 📊 **生产统计** - 产量、在制品、产能、周期时间
- 🔧 **工位利用率** - 各设备的利用率百分比
- 📝 **事件日志** - 实时记录所有生产事件

### 5️⃣ 停止仿真

随时可点击 **"⏹️ 停止"** 按钮

## Vue3 版本特性

### ✨ 新增功能

1. **组件化架构** - 更清晰的代码结构
2. **热模块替换 (HMR)** - 开发时修改代码即时更新
3. **响应式数据** - Vue的响应式系统自动更新UI
4. **TypeScript支持** - 更好的开发体验（可选）
5. **开发工具** - Vue DevTools支持

### 🔧 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **地图库**: OpenLayers 8.2.0
- **HTTP客户端**: Axios
- **样式**: CSS3 (保持原版样式)

## 常见问题

### Q: 前端启动失败？

**解决方案**：
```bash
# 清除缓存并重新安装
cd frontend-vue
rm -rf node_modules package-lock.json
npm install
```

### Q: 无法连接到后端API？

**检查**：
1. 后端服务器是否在运行（http://localhost:8000）
2. 查看浏览器控制台是否有CORS错误
3. 检查 `vite.config.js` 中的代理配置

### Q: WebSocket连接失败？

**检查**：
1. 后端WebSocket端点是否正常（ws://localhost:8000/ws）
2. 浏览器控制台是否有错误信息
3. 防火墙是否阻止了WebSocket连接

### Q: 开发模式和生产模式有什么区别？

**开发模式** (`npm run dev`)：
- 使用Vite代理转发API请求
- 支持热模块替换
- 启用Source Maps
- 访问地址：http://localhost:5173

**生产模式** (`npm run build`)：
- 构建优化的静态文件
- 代码压缩和混淆
- 输出到 `dist/` 目录
- 需要部署到Web服务器

## 生产部署

### 构建前端

```bash
cd frontend-vue
npm run build
```

构建输出在 `dist/` 目录

### 方式1：与后端集成部署

将 `dist/` 目录的内容复制到后端项目，更新后端服务器配置：

```python
# backend/server.py
app.mount("/", StaticFiles(directory="dist", html=True), name="static")
```

### 方式2：独立部署

使用Nginx等Web服务器托管 `dist/` 目录，配置反向代理到后端API。

## 开发提示

### 修改组件

所有Vue组件在 `frontend-vue/src/components/` 目录：
- `MapView.vue` - 地图可视化
- `ControlPanel.vue` - 控制面板
- `StatisticsPanel.vue` - 统计显示
- `EventLog.vue` - 事件日志

### 修改API逻辑

API相关代码在 `frontend-vue/src/composables/`：
- `useWebSocket.js` - WebSocket通信
- `useSimulationAPI.js` - REST API调用
- `useOpenLayers.js` - 地图逻辑

### 修改样式

全局样式在 `frontend-vue/src/style.css`

## 性能优化

### 开发模式优化

```javascript
// vite.config.js
export default defineConfig({
  server: {
    hmr: {
      overlay: false  // 禁用错误覆盖层
    }
  }
})
```

### 生产构建优化

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ol': ['ol']  // 将OpenLayers单独打包
        }
      }
    }
  }
})
```

## 相比原版的优势

| 特性 | 原版 (静态HTML) | Vue3版本 |
|------|----------------|----------|
| 开发体验 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 代码组织 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 热更新 | ❌ | ✅ |
| 组件复用 | ❌ | ✅ |
| 状态管理 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 可维护性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 扩展性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 获取帮助

遇到问题？
1. 查看浏览器控制台错误信息
2. 查看后端终端日志
3. 检查 `frontend-vue/README.md` 详细文档
4. 使用Vue DevTools调试组件状态

---

**祝您使用愉快！ 🎉**

