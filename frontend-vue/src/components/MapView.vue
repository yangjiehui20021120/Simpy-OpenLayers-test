<template>
  <div class="map-container">
    <div id="map" ref="mapRef" style="width: 100%; height: 100%;"></div>
    
    <!-- 层级提示信息 -->
    <div class="level-indicator" v-if="levelInfo">
      <div class="level-title">🗺️ 当前层级</div>
      <div class="level-content">
        <div class="level-name">{{ getLevelName(levelInfo.level) }}</div>
        <div class="level-details" v-if="levelInfo.region">
          📌 {{ levelInfo.region.name }}
        </div>
        <div class="level-zoom">
          Zoom: {{ levelInfo.zoom?.toFixed(1) || '2.0' }}
        </div>
      </div>
    </div>
    
    <!-- 图例 -->
    <div class="legend">
      <div class="legend-title">图例</div>
      <div class="legend-item">
        <div class="legend-icon" style="background: #1890ff;"></div>
        <span>物料</span>
      </div>
      <div class="legend-item">
        <div class="legend-icon" style="background: #52c41a;"></div>
        <span>工位（运行）</span>
      </div>
      <div class="legend-item">
        <div class="legend-icon" style="background: #d9d9d9;"></div>
        <span>工位（空闲）</span>
      </div>
      <div class="legend-item">
        <div class="legend-icon" style="background: #faad14; border-radius: 2px;"></div>
        <span>缓冲区</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useOpenLayers } from '../composables/useOpenLayers'

const props = defineProps({
  simulationEvents: {
    type: Array,
    default: () => []
  },
  statistics: {
    type: Object,
    default: () => ({})
  },
  layerVisibility: {
    type: Object,
    default: () => ({})
  }
})

const mapRef = ref(null)
const levelInfo = ref(null)
let mapControl = null

const { 
  initMap, 
  handleSimulationEvent,
  clearParts,
  resetWorkstations,
  setLayerVisibility,
  setBaseMap,
  getCurrentLevelInfo
} = useOpenLayers()

// 暴露地图控制接口
const exposeMapControl = () => {
  mapControl = {
    setLayerVisibility,
    setBaseMap,
    getCurrentLevelInfo
  }
  return mapControl
}

// 监听仿真事件
watch(() => props.simulationEvents, (events) => {
  if (events.length > 0) {
    const latestEvent = events[events.length - 1]
    handleSimulationEvent(latestEvent)
  }
}, { deep: true })

// 监听统计数据变化（用于更新缓冲区显示）
watch(() => props.statistics, (stats) => {
  // 可以在这里更新缓冲区的显示
}, { deep: true })

// 监听图层可见性变化
watch(() => props.layerVisibility, (visibility) => {
  if (mapControl) {
    Object.keys(visibility).forEach(layerName => {
      mapControl.setLayerVisibility(layerName, visibility[layerName])
    })
  }
}, { deep: true })

// 更新层级信息
const updateLevelInfo = () => {
  if (mapControl) {
    levelInfo.value = mapControl.getCurrentLevelInfo()
  }
}

let levelInfoInterval = null

onMounted(async () => {
  await initMap(mapRef.value, props.layerVisibility)
  exposeMapControl()
  updateLevelInfo()
  
  // 定期更新层级信息
  levelInfoInterval = setInterval(updateLevelInfo, 500)
})

onUnmounted(() => {
  if (levelInfoInterval) {
    clearInterval(levelInfoInterval)
  }
})

// 获取层级名称
const getLevelName = (level) => {
  const names = {
    'OVERVIEW': '📍 车间全景视图',
    'REGION': '🔍 区域概览',
    'DETAIL': '📌 详细视图'
  }
  return names[level] || level
}

// 暴露给父组件
defineExpose({
  mapControl: exposeMapControl
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.level-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border: 2px solid #0066ff;
  font-size: 13px;
  z-index: 1000;
  min-width: 180px;
}

.level-title {
  margin-bottom: 6px;
  color: #0066ff;
  font-weight: bold;
}

.level-content {
  color: #333;
  font-size: 12px;
}

.level-name {
  margin-bottom: 4px;
  font-weight: bold;
}

.level-details {
  margin-bottom: 4px;
  color: #0066ff;
}

.level-zoom {
  margin-top: 6px;
  font-size: 11px;
  color: #666;
}

.legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 1000;
}

.legend-title {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
  color: #666;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
  border: 1px solid rgba(0,0,0,0.1);
}
</style>

