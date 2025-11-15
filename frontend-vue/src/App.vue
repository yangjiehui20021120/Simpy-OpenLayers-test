<template>
  <div>
    <div class="header">
      <h1>🏭 SimPy-OpenLayers 生产线仿真可视化系统</h1>
      <p>基于SimPy的离散事件仿真 + OpenLayers地理可视化 (Vue3版本)</p>
    </div>

    <div class="container">
      <!-- 左侧区域 -->
      <div class="left-section">
        <!-- 地图区域 -->
        <MapView 
          ref="mapViewRef"
          :simulation-events="simulationEvents"
          :statistics="statistics"
          :layer-visibility="layerVisibility"
        />

        <!-- 事件日志 -->
        <EventLog :events="eventLogs" />
      </div>

      <!-- 右侧边栏 -->
      <div class="sidebar">
        <!-- 图层控制 -->
        <LayerControl 
          :map-control="mapControl"
          @layer-toggle="handleLayerToggle"
          @theme-change="handleThemeChange"
          @basemap-change="handleBaseMapChange"
        />

        <!-- 控制面板 -->
        <ControlPanel
          :is-running="isRunning"
          :status-text="statusText"
          @start="handleStart"
          @stop="handleStop"
        />

        <!-- 统计面板 -->
        <StatisticsPanel :statistics="statistics" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MapView from './components/MapView.vue'
import EventLog from './components/EventLog.vue'
import ControlPanel from './components/ControlPanel.vue'
import StatisticsPanel from './components/StatisticsPanel.vue'
import LayerControl from './components/LayerControl.vue'
import { useWebSocket } from './composables/useWebSocket'
import { useSimulationAPI } from './composables/useSimulationAPI'

const isRunning = ref(false)
const statusText = ref('就绪')
const simulationEvents = ref([])
const eventLogs = ref([])
const statistics = ref({
  parts_produced: 0,
  parts_in_system: 0,
  throughput: 0,
  avg_cycle_time: 0,
  workstation_utilization: Array(9).fill(0)
})

// 图层可见性状态
const layerVisibility = ref({
  workstation: true,
  material: true,
  buffer: true,
  path: true,
  zone: true,
  boundary: true
})

// 地图控制引用
const mapViewRef = ref(null)
const mapControl = ref(null)

const { startSimulation, stopSimulation, fetchStatistics } = useSimulationAPI()
const { connect, disconnect, onMessage } = useWebSocket()

// 处理仿真事件
const handleSimulationEvent = (event) => {
  simulationEvents.value.push(event)
  
  // 添加到日志
  addLog(event.type, JSON.stringify(event.data), event.timestamp)
  
  // 处理特定事件
  if (event.type === 'simulation_completed' || event.type === 'simulation_stopped') {
    isRunning.value = false
    statusText.value = event.type === 'simulation_completed' ? '仿真完成' : '已停止'
    addLog('system', `仿真结束! 共生产 ${event.data.parts_produced || 0} 件产品`)
  }
}

// 添加日志
const addLog = (type, message, timestamp) => {
  const time = timestamp ? timestamp.toFixed(2) : new Date().toLocaleTimeString()
  eventLogs.value.unshift({
    time,
    type,
    message
  })
  
  // 限制日志数量
  if (eventLogs.value.length > 100) {
    eventLogs.value = eventLogs.value.slice(0, 100)
  }
}

// 定期更新统计信息
let statsInterval = null
const updateStatistics = async () => {
  try {
    const stats = await fetchStatistics()
    if (stats.statistics) {
      statistics.value = stats.statistics
    }
  } catch (error) {
    console.error('Failed to update statistics:', error)
  }
}

// 启动仿真
const handleStart = async (duration) => {
  try {
    // 清空数据
    simulationEvents.value = []
    eventLogs.value = []
    
    isRunning.value = true
    statusText.value = '仿真运行中...'
    
    await startSimulation(duration)
    addLog('system', `启动仿真，时长: ${duration}秒`)
  } catch (error) {
    console.error('Failed to start simulation:', error)
    addLog('error', '启动仿真失败')
    isRunning.value = false
    statusText.value = '错误'
  }
}

// 停止仿真
const handleStop = async () => {
  try {
    await stopSimulation()
    isRunning.value = false
    statusText.value = '已停止'
    addLog('system', '仿真已停止')
  } catch (error) {
    console.error('Failed to stop simulation:', error)
  }
}

// 处理图层切换
const handleLayerToggle = ({ layerName, visible }) => {
  layerVisibility.value[layerName] = visible
}

// 处理主题切换
const handleThemeChange = (theme) => {
  console.log('主题切换:', theme)
  // 主题切换逻辑已在 LayerControl 组件中处理
}

// 处理底图切换
const handleBaseMapChange = (baseMapType) => {
  console.log('底图切换:', baseMapType)
  if (mapControl.value) {
    if (baseMapType === 'image') {
      mapControl.value.setBaseMap('/map_image.png')
      mapControl.value.setLayerVisibility('baseImage', true)
    } else if (baseMapType === 'none') {
      mapControl.value.setLayerVisibility('baseImage', false)
    }
  }
}

onMounted(() => {
  // 连接WebSocket
  connect()
  onMessage(handleSimulationEvent)
  
  // 定期更新统计
  statsInterval = setInterval(updateStatistics, 1000)
  
  // 获取地图控制接口
  setTimeout(() => {
    if (mapViewRef.value) {
      mapControl.value = mapViewRef.value.mapControl
    }
  }, 1000)
  
  addLog('system', '已连接到仿真服务器')
})

onUnmounted(() => {
  disconnect()
  if (statsInterval) {
    clearInterval(statsInterval)
  }
})
</script>

