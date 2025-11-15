# 🏭 SimPy-OpenLayers 生产线仿真可视化系统 (Vue3版本)

一个融合 **SimPy** 离散事件仿真和 **OpenLayers** 地理可视化的智能制造演示系统，现已升级到 **Vue3** 框架！

## 📋 项目简介

本项目展示了如何将生产系统仿真分析与地图可视化技术相结合，实现：

- ✅ **SimPy** - 强大的生产线离散事件仿真引擎
- ✅ **OpenLayers** - 专业的地理空间数据可视化
- ✅ **Vue3** - 现代化的前端框架（组合式API）
- ✅ **Vite** - 新一代前端构建工具
- ✅ **实时通信** - WebSocket 实时推送仿真数据
- ✅ **动态展示** - 车间布局、设备状态、物料流转的实时可视化

## 🆕 Vue3版本新特性

### 相比原版的改进

| 特性 | 原版 | Vue3版本 |
|------|------|----------|
| 前端框架 | 原生JavaScript | Vue3 (Composition API) |
| 构建工具 | 无 | Vite (超快HMR) |
| 代码组织 | 单文件 | 组件化 + Composables |
| 状态管理 | 全局变量 | 响应式系统 |
| 开发体验 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 热更新 | ❌ | ✅ |
| 组件复用 | ❌ | ✅ |
| 可维护性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 扩展性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 核心架构改进

1. **组件化设计**
   - MapView - 地图可视化组件
   - ControlPanel - 控制面板组件
   - StatisticsPanel - 统计面板组件
   - EventLog - 事件日志组件

2. **Composables（可复用逻辑）**
   - useWebSocket - WebSocket连接管理
   - useSimulationAPI - API调用封装
   - useOpenLayers - OpenLayers地图逻辑

3. **响应式数据流**
   - Vue的响应式系统自动更新UI
   - 无需手动操作DOM
   - 更清晰的数据流向

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────┐
│              前端 (Vue3 + Vite)                      │
│  ┌──────────────┐         ┌──────────────┐          │
│  │   Vue 3      │ ◄─────► │  WebSocket   │          │
│  │ Components   │         │   Client     │          │
│  │              │         │              │          │
│  │ + OpenLayers │         │              │          │
│  └──────────────┘         └──────────────┘          │
└─────────────────────────────────────────────────────┘
                             ▲
                             │ WebSocket + HTTP
                             ▼
┌─────────────────────────────────────────────────────┐
│              后端 (Python + FastAPI)                 │
│  ┌──────────────┐         ┌──────────────┐          │
│  │   FastAPI    │ ◄─────► │  WebSocket   │          │
│  │  HTTP Server │         │    Server    │          │
│  └──────────────┘         └──────────────┘          │
│                               │                      │
│                               ▼                      │
│                    ┌──────────────────┐              │
│                    │   SimPy Engine   │              │
│                    │   仿真引擎        │              │
│                    └──────────────────┘              │
└─────────────────────────────────────────────────────┘
```

## 🚀 快速开始

### 前置要求

- Python 3.8+
- Node.js 16+ (推荐 LTS 版本)
- 现代浏览器（Chrome, Firefox, Edge）

### 安装依赖

```bash
# 安装 Python 依赖
pip install -r requirements.txt

# 安装前端依赖
cd frontend-vue
npm install
```

### 运行系统

**方式1：使用启动脚本（推荐）**

Windows:
```bash
# 终端1：启动后端
cd backend
python server.py

# 终端2：启动前端
cd frontend-vue
start-dev.bat
```

Linux/Mac:
```bash
# 终端1：启动后端
cd backend
python3 server.py

# 终端2：启动前端
cd frontend-vue
./start-dev.sh
```

**方式2：手动启动**

```bash
# 终端1：启动后端
cd backend
python server.py

# 终端2：启动前端
cd frontend-vue
npm run dev
```

### 访问系统

- **前端开发服务器**: http://localhost:5173
- **后端API服务器**: http://localhost:8000

## 📁 项目结构

```
Simpy-OpenLayers-test/
├── backend/                    # 后端（Python）
│   ├── simulation.py          # SimPy 仿真模型
│   └── server.py              # FastAPI 服务器 + WebSocket
│
├── frontend/                   # 原版前端（保留）
│   ├── index.html
│   └── app.js
│
├── frontend-vue/               # Vue3前端（新版）
│   ├── src/
│   │   ├── components/        # Vue组件
│   │   │   ├── MapView.vue
│   │   │   ├── ControlPanel.vue
│   │   │   ├── StatisticsPanel.vue
│   │   │   └── EventLog.vue
│   │   ├── composables/       # 可复用逻辑
│   │   │   ├── useWebSocket.js
│   │   │   ├── useSimulationAPI.js
│   │   │   └── useOpenLayers.js
│   │   ├── App.vue           # 主应用组件
│   │   ├── main.js           # 应用入口
│   │   └── style.css         # 全局样式
│   ├── index.html
│   ├── vite.config.js        # Vite配置
│   ├── package.json
│   ├── start-dev.sh          # 启动脚本（Linux/Mac）
│   ├── start-dev.bat         # 启动脚本（Windows）
│   └── README.md
│
├── requirements.txt           # Python 依赖
├── README.md                  # 项目文档（原版）
├── README_VUE3.md            # 项目文档（Vue3版本）
├── QUICKSTART_VUE3.md        # Vue3快速开始指南
└── MIGRATION_GUIDE.md        # 迁移指南
```

## 🔧 技术栈

### 后端（不变）
- **SimPy 4.1.1** - 离散事件仿真框架
- **FastAPI 0.109.0** - 现代化 Web 框架
- **Uvicorn** - ASGI 服务器
- **WebSockets** - 实时双向通信

### 前端（新增）
- **Vue 3** - 渐进式JavaScript框架
- **Vite 5** - 新一代前端构建工具
- **OpenLayers 8.2.0** - 开源地图库
- **Axios** - HTTP客户端
- **WebSocket API** - 浏览器原生 WebSocket

## 📊 仿真模型说明

### 生产线配置

- **工位数量**: 9个工位
  - 工位1: 预处理
  - 工位2-3: 粗加工（并列）
  - 工位4-5: 精加工（并列）
  - 工位6: 组装
  - 工位7-8: 质检（并列）
  - 工位9: 包装

- **缓冲区**: 5个公用缓存区，容量各5件

- **加工时间**: 符合正态分布 N(5, 1) 秒

- **到达间隔**: 符合指数分布，平均6秒

## 📈 统计指标

系统实时计算并显示以下KPI：

- **已生产数量** - 完成的产品总数
- **在制品(WIP)** - 系统中正在加工的产品数
- **产能** - 单位时间产量（件/秒）
- **周期时间** - 产品从进入到完成的平均时间
- **工位利用率** - 各工位的设备利用率（%）
- **排队时间** - 产品在各工位的平均等待时间

## 🎨 可视化元素

| 元素 | 颜色/形状 | 说明 |
|------|----------|------|
| 物料 | 蓝色圆点 | 移动的产品 |
| 工位（运行） | 绿色圆圈 | 正在加工 |
| 工位（空闲） | 灰色圆圈 | 等待物料 |
| 缓冲区 | 黄色菱形 | 显示库存数量 |
| 原料区 | 蓝色虚线框 | 物料起点 |
| 成品区 | 绿色虚线框 | 物料终点 |

## 🎓 使用说明

详细的使用指南请查看：
- **Vue3版本**: [QUICKSTART_VUE3.md](QUICKSTART_VUE3.md)
- **原版**: [QUICKSTART.md](QUICKSTART.md)
- **迁移指南**: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

## 🔮 扩展方向

基于Vue3架构，可以轻松扩展：

1. **多页面应用**
   - 使用 Vue Router
   - 增加配置页面、历史记录页面等

2. **状态管理**
   - 集成 Pinia
   - 更复杂的状态管理

3. **类型安全**
   - 迁移到 TypeScript
   - 更好的开发体验

4. **UI组件库**
   - 集成 Element Plus / Ant Design Vue
   - 更丰富的UI组件

5. **测试**
   - Vitest 单元测试
   - Cypress E2E测试

6. **国际化**
   - vue-i18n
   - 多语言支持

## 📚 参考资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [SimPy 官方文档](https://simpy.readthedocs.io/)
- [OpenLayers 官方文档](https://openlayers.org/)
- [FastAPI 官方文档](https://fastapi.tiangolo.com/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

MIT License

## 👨‍💻 版本历史

- **v2.0** (2024) - Vue3版本，组件化架构
- **v1.0** (2024) - 原始版本，静态HTML

---

**🌟 如果这个项目对您有帮助，请给一个 Star！**

