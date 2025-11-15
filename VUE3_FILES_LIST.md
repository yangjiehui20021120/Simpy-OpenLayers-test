# 📋 Vue3版本文件清单

本文档列出Vue3前端项目的所有文件及其用途。

## 项目根目录新增文件

```
Simpy-OpenLayers-test/
├── README_VUE3.md            # Vue3版本项目说明文档
├── QUICKSTART_VUE3.md        # Vue3快速开始指南
├── MIGRATION_GUIDE.md        # 从原版迁移到Vue3的指南
└── VUE3_FILES_LIST.md        # 本文件（文件清单）
```

## frontend-vue/ 目录结构

### 配置文件

```
frontend-vue/
├── package.json              # npm项目配置和依赖
├── vite.config.js           # Vite构建工具配置
├── index.html               # HTML模板入口
├── .gitignore               # Git忽略文件配置
├── start-dev.sh             # Linux/Mac启动脚本
├── start-dev.bat            # Windows启动脚本
└── README.md                # 前端项目说明文档
```

### 源代码目录 (src/)

```
src/
├── main.js                  # Vue应用入口文件
├── App.vue                  # 主应用组件（根组件）
├── style.css                # 全局样式文件
│
├── components/              # Vue组件目录
│   ├── MapView.vue         # 地图可视化组件
│   ├── ControlPanel.vue    # 控制面板组件
│   ├── StatisticsPanel.vue # 统计数据面板组件
│   └── EventLog.vue        # 事件日志组件
│
└── composables/             # 可复用逻辑（Composition API）
    ├── useWebSocket.js      # WebSocket连接管理
    ├── useSimulationAPI.js  # 后端API调用封装
    └── useOpenLayers.js     # OpenLayers地图逻辑
```

## 文件功能详解

### 核心文件

#### `main.js` - 应用入口
- 创建Vue应用实例
- 导入全局样式
- 挂载到DOM

#### `App.vue` - 主组件
- 整体布局结构
- 状态管理（仿真状态、统计数据、日志）
- WebSocket连接初始化
- 组件间数据流管理

#### `style.css` - 全局样式
- 保持与原版一致的UI样式
- 响应式设计
- 动画效果

### Vue组件

#### `MapView.vue` - 地图组件
**功能**：
- OpenLayers地图渲染
- 车间布局显示
- 物料动画展示
- 工位状态更新

**Props**：
- `simulationEvents` - 仿真事件数组
- `statistics` - 统计数据对象

#### `ControlPanel.vue` - 控制面板
**功能**：
- 仿真时长设置
- 开始/停止按钮
- 状态指示器

**Props**：
- `isRunning` - 仿真运行状态
- `statusText` - 状态文本

**Events**：
- `@start` - 开始仿真事件
- `@stop` - 停止仿真事件

#### `StatisticsPanel.vue` - 统计面板
**功能**：
- 实时统计数据展示
- 工位利用率柱状图
- 生产指标显示

**Props**：
- `statistics` - 统计数据对象

#### `EventLog.vue` - 事件日志
**功能**：
- 事件日志滚动显示
- 日志条目格式化

**Props**：
- `events` - 日志事件数组

### Composables（可复用逻辑）

#### `useWebSocket.js` - WebSocket管理
**功能**：
- WebSocket连接/断开
- 消息接收处理
- 连接状态管理

**API**：
```javascript
const { connect, disconnect, onMessage, isConnected } = useWebSocket()
```

#### `useSimulationAPI.js` - API服务
**功能**：
- 后端API调用封装
- 请求/响应处理
- 错误处理

**API**：
```javascript
const { 
  startSimulation, 
  stopSimulation, 
  fetchStatistics, 
  fetchWorkshopLayout 
} = useSimulationAPI()
```

#### `useOpenLayers.js` - 地图逻辑
**功能**：
- 地图初始化
- 车间布局加载
- 物料要素管理
- 动画控制

**API**：
```javascript
const { 
  initMap, 
  handleSimulationEvent,
  clearParts,
  resetWorkstations
} = useOpenLayers()
```

## 配置文件说明

### `package.json`
```json
{
  "dependencies": {
    "vue": "^3.4.0",        // Vue 3核心
    "ol": "^8.2.0",         // OpenLayers地图库
    "axios": "^1.6.0"       // HTTP客户端
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",  // Vite的Vue插件
    "vite": "^5.0.0"                  // Vite构建工具
  }
}
```

### `vite.config.js`
```javascript
{
  server: {
    port: 5173,              // 开发服务器端口
    proxy: {
      '/api': 'http://localhost:8000',  // API代理
      '/ws': 'ws://localhost:8000'       // WebSocket代理
    }
  }
}
```

## 文件大小统计

| 类型 | 文件数 | 说明 |
|------|--------|------|
| Vue组件 | 5个 | App.vue + 4个子组件 |
| Composables | 3个 | useWebSocket, useSimulationAPI, useOpenLayers |
| 配置文件 | 4个 | package.json, vite.config.js, index.html, .gitignore |
| 样式文件 | 1个 | style.css |
| 脚本文件 | 2个 | start-dev.sh, start-dev.bat |
| 文档文件 | 1个 | README.md |
| **总计** | **16个** | |

## 代码行数统计（估算）

| 文件 | 行数 | 说明 |
|------|------|------|
| App.vue | ~150行 | 主组件逻辑 |
| MapView.vue | ~80行 | 地图组件 |
| ControlPanel.vue | ~60行 | 控制面板 |
| StatisticsPanel.vue | ~80行 | 统计面板 |
| EventLog.vue | ~30行 | 事件日志 |
| useWebSocket.js | ~50行 | WebSocket逻辑 |
| useSimulationAPI.js | ~30行 | API调用 |
| useOpenLayers.js | ~400行 | OpenLayers逻辑 |
| style.css | ~350行 | 全局样式 |
| **总计** | **~1,230行** | 高质量代码 |

## 与原版对比

| 项目 | 原版 | Vue3版本 |
|------|------|----------|
| 文件数量 | 2个 (HTML+JS) | 16个 (组件化) |
| 代码行数 | ~850行 | ~1,230行 |
| 构建工具 | 无 | Vite |
| 依赖管理 | CDN | npm |
| 开发体验 | 基础 | 现代化 |

## 快速查找

### 修改UI样式
→ `src/style.css`

### 修改地图逻辑
→ `src/composables/useOpenLayers.js`

### 修改API调用
→ `src/composables/useSimulationAPI.js`

### 修改WebSocket
→ `src/composables/useWebSocket.js`

### 修改控制面板
→ `src/components/ControlPanel.vue`

### 修改统计显示
→ `src/components/StatisticsPanel.vue`

### 修改地图组件
→ `src/components/MapView.vue`

### 修改日志显示
→ `src/components/EventLog.vue`

## 下一步

1. **安装依赖**：`cd frontend-vue && npm install`
2. **启动开发**：`npm run dev`
3. **构建生产**：`npm run build`
4. **查看文档**：阅读 `README_VUE3.md` 和 `QUICKSTART_VUE3.md`

---

**更新日期**: 2024
**版本**: v2.0.0

