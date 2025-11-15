<template>
  <div class="layer-control">
    <h3>🗺️ 图层控制</h3>
    
    <!-- 图层开关 -->
    <div class="layer-switches">
      <div class="switch-group">
        <label class="switch-label">
          <input 
            type="checkbox" 
            v-model="layerVisibility.workstation"
            @change="handleLayerToggle('workstation', $event.target.checked)"
          />
          <span class="color-dot" style="background: #52c41a;"></span>
          <span>工位</span>
        </label>
        
        <label class="switch-label">
          <input 
            type="checkbox" 
            v-model="layerVisibility.material"
            @change="handleLayerToggle('material', $event.target.checked)"
          />
          <span class="color-dot" style="background: #1890ff;"></span>
          <span>物料</span>
        </label>
        
        <label class="switch-label">
          <input 
            type="checkbox" 
            v-model="layerVisibility.buffer"
            @change="handleLayerToggle('buffer', $event.target.checked)"
          />
          <span class="color-dot" style="background: #faad14;"></span>
          <span>缓冲区</span>
        </label>
        
        <label class="switch-label">
          <input 
            type="checkbox" 
            v-model="layerVisibility.path"
            @change="handleLayerToggle('path', $event.target.checked)"
          />
          <span class="color-dot" style="background: #bfbfbf;"></span>
          <span>路径</span>
        </label>
        
        <label class="switch-label">
          <input 
            type="checkbox" 
            v-model="layerVisibility.zone"
            @change="handleLayerToggle('zone', $event.target.checked)"
          />
          <span class="color-dot" style="background: #1890ff; border-radius: 2px;"></span>
          <span>区域</span>
        </label>
        
        <label class="switch-label">
          <input 
            type="checkbox" 
            v-model="layerVisibility.boundary"
            @change="handleLayerToggle('boundary', $event.target.checked)"
          />
          <span class="color-dot" style="background: #333;"></span>
          <span>边界</span>
        </label>
      </div>
    </div>

    <!-- 主题视图 -->
    <div class="theme-selector">
      <label class="input-label">
        <strong>视图模式：</strong>
        <select v-model="viewTheme" @change="handleThemeChange">
          <option value="all">全部</option>
          <option value="production">生产视图</option>
          <option value="buffer">缓冲区视图</option>
        </select>
      </label>
    </div>

    <!-- 底图设置 -->
    <div class="basemap-selector">
      <label class="input-label">
        <strong>底图设置：</strong>
        <select v-model="baseMapType" @change="handleBaseMapChange">
          <option value="none">无底图</option>
          <option value="image">图片底图</option>
          <option value="geojson">矢量底图</option>
        </select>
      </label>
    </div>

    <!-- 层级信息显示 -->
    <div class="level-info" v-if="levelInfo">
      <div class="info-item">
        <span class="info-label">当前层级：</span>
        <span class="info-value">{{ getLevelName(levelInfo.level) }}</span>
      </div>
      <div class="info-item" v-if="levelInfo.region">
        <span class="info-label">活动区域：</span>
        <span class="info-value">{{ levelInfo.region.name }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">缩放级别：</span>
        <span class="info-value">{{ levelInfo.zoom?.toFixed(1) || '2.0' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { VIEW_THEMES } from '../config/mapLayers'

const props = defineProps({
  mapControl: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['layer-toggle', 'theme-change', 'basemap-change'])

// 图层可见性状态
const layerVisibility = ref({
  workstation: true,
  material: true,
  buffer: true,
  path: true,
  zone: true,
  boundary: true
})

// 主题视图
const viewTheme = ref('all')

// 底图类型
const baseMapType = ref('none')

// 层级信息
const levelInfo = ref(null)

// 处理图层切换
const handleLayerToggle = (layerName, visible) => {
  emit('layer-toggle', { layerName, visible })
  if (props.mapControl?.setLayerVisibility) {
    props.mapControl.setLayerVisibility(layerName, visible)
  }
}

// 处理主题切换
const handleThemeChange = () => {
  const theme = VIEW_THEMES[viewTheme.value]
  if (!theme) return

  // 先隐藏所有图层
  Object.keys(layerVisibility.value).forEach(key => {
    layerVisibility.value[key] = false
    handleLayerToggle(key, false)
  })

  // 显示主题相关的图层
  theme.layers.forEach(layerName => {
    if (layerVisibility.value.hasOwnProperty(layerName)) {
      layerVisibility.value[layerName] = true
      handleLayerToggle(layerName, true)
    }
  })

  emit('theme-change', viewTheme.value)
}

// 处理底图切换
const handleBaseMapChange = () => {
  emit('basemap-change', baseMapType.value)
  if (props.mapControl?.setBaseMap) {
    if (baseMapType.value === 'image') {
      props.mapControl.setBaseMap('/map_image.png')
    } else if (baseMapType.value === 'none') {
      // 隐藏底图
      if (props.mapControl?.setLayerVisibility) {
        props.mapControl.setLayerVisibility('baseImage', false)
      }
    }
  }
}

// 获取层级名称
const getLevelName = (level) => {
  const names = {
    'OVERVIEW': '车间全景',
    'REGION': '区域视图',
    'DETAIL': '详细视图'
  }
  return names[level] || level
}

// 更新层级信息
const updateLevelInfo = () => {
  if (props.mapControl?.getCurrentLevelInfo) {
    levelInfo.value = props.mapControl.getCurrentLevelInfo()
  }
}

// 监听层级信息变化
watch(() => props.mapControl, () => {
  updateLevelInfo()
}, { deep: true })

// 定期更新层级信息
let levelInfoInterval = null
onMounted(() => {
  updateLevelInfo()
  levelInfoInterval = setInterval(updateLevelInfo, 500)
})

// 清理
onUnmounted(() => {
  if (levelInfoInterval) {
    clearInterval(levelInfoInterval)
  }
})
</script>

<style scoped>
.layer-control {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 16px;
}

.layer-control h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

.layer-switches {
  margin-bottom: 16px;
}

.switch-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.switch-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.switch-label input[type="checkbox"] {
  margin-right: 8px;
  cursor: pointer;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  display: inline-block;
  border: 1px solid rgba(0,0,0,0.1);
}

.theme-selector,
.basemap-selector {
  margin-bottom: 16px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.input-label strong {
  color: #333;
  min-width: 80px;
}

.input-label select {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.level-info {
  padding: 12px;
  background: #f0f2f5;
  border-radius: 4px;
  font-size: 13px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
  font-weight: bold;
}
</style>

