# 📦 Vue3迁移指南

本文档说明了从静态HTML版本迁移到Vue3版本的详细信息。

## 项目结构对比

### 原版结构
```
frontend/
├── index.html    # 单页面HTML
└── app.js        # 所有逻辑
```

### Vue3版本结构
```
frontend-vue/
├── src/
│   ├── components/          # 组件化
│   │   ├── MapView.vue
│   │   ├── ControlPanel.vue
│   │   ├── StatisticsPanel.vue
│   │   └── EventLog.vue
│   ├── composables/         # 可复用逻辑
│   │   ├── useWebSocket.js
│   │   ├── useSimulationAPI.js
│   │   └── useOpenLayers.js
│   ├── App.vue             # 主组件
│   ├── main.js             # 入口
│   └── style.css           # 全局样式
├── index.html
├── vite.config.js
└── package.json
```

## 代码迁移对比

### 1. 初始化地图

**原版 (app.js)**
```javascript
function initMap() {
    map = new ol.Map({
        target: 'map',
        layers: [workshopLayer, partsLayer],
        view: view
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initMap();
});
```

**Vue3版本 (MapView.vue)**
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useOpenLayers } from '../composables/useOpenLayers'

const mapRef = ref(null)
const { initMap } = useOpenLayers()

onMounted(() => {
    initMap(mapRef.value)
})
</script>
```

### 2. WebSocket连接

**原版 (app.js)**
```javascript
function connectWebSocket() {
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleSimulationEvent(message);
    };
}
```

**Vue3版本 (useWebSocket.js)**
```javascript
export function useWebSocket() {
  const connect = () => {
    ws = new WebSocket(wsUrl)
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (messageCallback) {
        messageCallback(message)
      }
    }
  }
  
  return { connect, disconnect, onMessage }
}
```

### 3. 状态管理

**原版 (app.js)**
```javascript
// 全局变量
let isRunning = false;
let statusText = '就绪';

// 手动更新DOM
document.getElementById('statusText').textContent = statusText;
```

**Vue3版本 (App.vue)**
```vue
<script setup>
import { ref } from 'vue'

const isRunning = ref(false)
const statusText = ref('就绪')

// Vue自动更新DOM
</script>

<template>
  <span>{{ statusText }}</span>
</template>
```

### 4. 事件处理

**原版 (app.js)**
```javascript
document.getElementById('startBtn').addEventListener('click', startSimulation);

async function startSimulation() {
    // 手动禁用按钮
    document.getElementById('startBtn').disabled = true;
    
    const response = await fetch('/api/simulation/start', {
        method: 'POST'
    });
}
```

**Vue3版本 (ControlPanel.vue)**
```vue
<script setup>
const emit = defineEmits(['start'])

const handleStart = () => {
  emit('start', duration.value)
}
</script>

<template>
  <button 
    :disabled="isRunning"
    @click="handleStart"
  >
    开始仿真
  </button>
</template>
```

### 5. 统计数据更新

**原版 (app.js)**
```javascript
async function updateStatistics() {
    const response = await fetch('/api/simulation/status');
    const data = await response.json();
    
    // 手动更新每个元素
    document.getElementById('produced').innerHTML = 
        `${stats.parts_produced}<span class="stat-unit">件</span>`;
}

// 定时更新
setInterval(updateStatistics, 1000);
```

**Vue3版本 (App.vue + StatisticsPanel.vue)**
```vue
<!-- App.vue -->
<script setup>
const statistics = ref({ parts_produced: 0, ... })

const updateStatistics = async () => {
  const stats = await fetchStatistics()
  statistics.value = stats.statistics  // Vue自动更新
}

onMounted(() => {
  setInterval(updateStatistics, 1000)
})
</script>

<!-- StatisticsPanel.vue -->
<template>
  <div class="stat-value">
    {{ statistics.parts_produced }}
    <span class="stat-unit">件</span>
  </div>
</template>
```

## 主要改进

### ✅ 架构改进

1. **组件化**
   - 原版：所有代码在一个文件
   - Vue3：分离成多个可复用组件

2. **状态管理**
   - 原版：全局变量 + 手动DOM操作
   - Vue3：响应式状态 + 自动更新

3. **代码组织**
   - 原版：按功能类型组织（函数）
   - Vue3：按业务逻辑组织（组件 + Composables）

### ✅ 开发体验改进

1. **热更新** - 修改代码立即看到效果
2. **开发工具** - Vue DevTools支持
3. **类型提示** - 更好的IDE支持
4. **错误提示** - 更清晰的错误信息

### ✅ 性能改进

1. **虚拟DOM** - 更高效的DOM更新
2. **按需加载** - Vite的代码分割
3. **打包优化** - 生产环境优化

## 功能对照表

| 功能 | 原版实现位置 | Vue3实现位置 |
|------|-------------|-------------|
| 地图初始化 | `app.js initMap()` | `useOpenLayers.js initMap()` |
| 车间布局加载 | `app.js loadWorkshopLayout()` | `useOpenLayers.js loadWorkshopLayout()` |
| WebSocket连接 | `app.js connectWebSocket()` | `useWebSocket.js` |
| 物料创建 | `app.js createPartFeature()` | `useOpenLayers.js createPartFeature()` |
| 物料移动动画 | `app.js animateMove()` | `useOpenLayers.js animateMove()` |
| 统计更新 | `app.js updateStatistics()` | `App.vue updateStatistics()` |
| 启动仿真 | `app.js startSimulation()` | `App.vue handleStart()` |
| 停止仿真 | `app.js stopSimulation()` | `App.vue handleStop()` |
| 日志显示 | `app.js addLog()` | `App.vue addLog()` + `EventLog.vue` |

## 兼容性说明

### 保持不变的功能

✅ 所有原版功能完全保留
✅ UI样式保持一致
✅ 后端API接口不需要修改
✅ WebSocket通信协议不变

### API兼容性

Vue3版本使用相同的后端API：
- `GET /api/workshop-layout`
- `GET /api/simulation/status`
- `POST /api/simulation/start`
- `POST /api/simulation/stop`
- `WS /ws`

### 浏览器支持

- **原版**: IE11+ (需要polyfills)
- **Vue3**: Chrome 64+, Firefox 67+, Safari 12+, Edge 79+

## 迁移注意事项

### 1. 开发环境

需要安装Node.js和npm：
```bash
# 检查版本
node --version  # 应该 >= 16
npm --version   # 应该 >= 7
```

### 2. 依赖管理

原版不需要构建步骤，Vue3版本需要：
```bash
cd frontend-vue
npm install    # 安装依赖
npm run dev    # 开发模式
npm run build  # 生产构建
```

### 3. 部署方式

**原版部署**：
- 直接将HTML/JS文件放到Web服务器

**Vue3部署**：
- 需要先构建：`npm run build`
- 将 `dist/` 目录内容部署到服务器

### 4. 调试方式

**原版调试**：
- 浏览器控制台
- console.log

**Vue3调试**：
- 浏览器控制台
- Vue DevTools（推荐）
- Vite的错误覆盖层

## 未来扩展建议

基于Vue3架构，可以轻松添加：

1. **Vue Router** - 多页面应用
2. **Pinia** - 状态管理库
3. **TypeScript** - 类型安全
4. **Vitest** - 单元测试
5. **Element Plus** - UI组件库
6. **国际化 (i18n)** - 多语言支持

## 回退到原版

如果需要回退到原版：

1. 停止Vue3开发服务器
2. 使用原版启动方式：
   ```bash
   cd backend
   python server.py
   ```
3. 访问 http://localhost:8000（后端服务原版前端）

原版文件位于 `frontend/` 目录，未被修改。

---

**需要帮助？** 查看 `QUICKSTART_VUE3.md` 或 `frontend-vue/README.md`

