# 🏭 SimPy-OpenLayers Vue3 前端

基于Vue3的生产线仿真可视化前端应用。

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 新一代前端构建工具
- **OpenLayers 8.2.0** - 地理空间数据可视化
- **Axios** - HTTP客户端
- **WebSocket** - 实时双向通信

## 项目结构

```
frontend-vue/
├── src/
│   ├── components/          # Vue组件
│   │   ├── MapView.vue     # 地图可视化组件
│   │   ├── ControlPanel.vue # 控制面板组件
│   │   ├── StatisticsPanel.vue # 统计面板组件
│   │   └── EventLog.vue    # 事件日志组件
│   ├── composables/         # 组合式API
│   │   ├── useWebSocket.js # WebSocket通信
│   │   ├── useSimulationAPI.js # API服务
│   │   └── useOpenLayers.js # OpenLayers地图逻辑
│   ├── App.vue             # 主应用组件
│   ├── main.js             # 应用入口
│   └── style.css           # 全局样式
├── index.html              # HTML模板
├── vite.config.js          # Vite配置
└── package.json            # 项目配置

```

## 快速开始

### 安装依赖

```bash
cd frontend-vue
npm install
```

### 开发模式

```bash
npm run dev
```

访问：http://localhost:5173

> 注意：确保后端服务器在 `http://localhost:8000` 运行

### 生产构建

```bash
npm run build
```

构建输出在 `dist/` 目录

### 预览生产构建

```bash
npm run preview
```

## 核心功能

### 1. 响应式设计

使用Vue 3的Composition API实现高度模块化的代码：

- `useWebSocket` - WebSocket连接管理
- `useSimulationAPI` - API调用封装
- `useOpenLayers` - OpenLayers地图逻辑

### 2. 组件化

- **MapView** - OpenLayers地图展示和物料动画
- **ControlPanel** - 仿真控制（启动/停止）
- **StatisticsPanel** - 实时统计数据展示
- **EventLog** - 事件日志滚动显示

### 3. 实时通信

- WebSocket自动重连
- 事件驱动的数据更新
- 统计数据定时轮询

## 开发说明

### 代理配置

Vite开发服务器配置了代理，自动转发到后端：

- `/api/*` → `http://localhost:8000/api/*`
- `/ws` → `ws://localhost:8000/ws`

### 环境变量

开发模式下自动检测 `import.meta.env.DEV`

生产模式使用相对路径，与后端同域部署

## 部署

### 方式1：与后端一起部署

1. 构建前端：`npm run build`
2. 将 `dist/` 目录复制到后端项目
3. 更新后端服务器配置以提供静态文件

### 方式2：独立部署

1. 构建前端：`npm run build`
2. 部署到静态托管服务（Nginx, CDN等）
3. 配置CORS允许访问后端API

## 相比原版的改进

✅ **组件化** - 代码更模块化、可维护
✅ **响应式** - Vue的响应式系统自动更新UI
✅ **类型安全** - 更好的开发体验
✅ **热更新** - Vite提供超快的HMR
✅ **易扩展** - 更容易添加新功能

## 注意事项

1. 确保后端服务器支持CORS
2. WebSocket连接需要相同的协议（http/https）
3. 开发模式下使用代理，生产模式需要同域部署或配置CORS

