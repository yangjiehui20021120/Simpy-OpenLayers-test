/**
 * 多层级地图配置
 * 定义不同zoom级别下显示的地图图层
 */

export const MAP_LAYERS_CONFIG = {
  // 层级定义
  levels: {
    // Level 0: 车间全景（zoom 0-2）
    OVERVIEW: {
      minZoom: 0,
      maxZoom: 2,
      name: '车间全景',
      layers: ['overview'],
      extent: [0, 0, 120, 40]
    },
    
    // Level 1: 区域概览（zoom 2-4）
    REGION: {
      minZoom: 2,
      maxZoom: 4,
      name: '区域视图',
      layers: ['regions'],
      regions: [
        {
          id: 'input_zone',
          name: '输入区域',
          bounds: [0, 0, 20, 40],
          center: [10, 20],
          detailLayer: 'input_detail'
        },
        {
          id: 'production_zone',
          name: '生产区域',
          bounds: [20, 0, 100, 40],
          center: [60, 20],
          detailLayer: 'production_detail'
        },
        {
          id: 'output_zone',
          name: '输出区域',
          bounds: [100, 0, 120, 40],
          center: [110, 20],
          detailLayer: 'output_detail'
        }
      ]
    },
    
    // Level 2: 详细视图（zoom > 4）
    DETAIL: {
      minZoom: 4,
      maxZoom: 10,
      name: '详细视图',
      layers: ['details']
    }
  },
  
  // 缩放级别阈值
  zoomThresholds: {
    showRegions: 1.8,    // zoom > 1.8 时显示区域边界
    showDetails: 3.5,    // zoom > 3.5 时显示详细图层
    hideOverview: 2.5    // zoom > 2.5 时降低总览图层透明度
  }
};

/**
 * 根据当前zoom和中心点判断应该显示哪个详细图层
 */
export function getActiveRegion(zoom, center) {
  if (zoom < MAP_LAYERS_CONFIG.zoomThresholds.showDetails) {
    return null;
  }
  
  const regions = MAP_LAYERS_CONFIG.levels.REGION.regions;
  const [centerX, centerY] = center;
  
  for (const region of regions) {
    const [minX, minY, maxX, maxY] = region.bounds;
    if (centerX >= minX && centerX <= maxX && 
        centerY >= minY && centerY <= maxY) {
      return region;
    }
  }
  
  return null;
}

/**
 * 根据zoom级别获取当前层级
 */
export function getCurrentLevel(zoom) {
  if (zoom <= MAP_LAYERS_CONFIG.zoomThresholds.showRegions) {
    return 'OVERVIEW';
  } else if (zoom <= MAP_LAYERS_CONFIG.zoomThresholds.showDetails) {
    return 'REGION';
  } else {
    return 'DETAIL';
  }
}

/**
 * 图层类型定义
 */
export const LAYER_TYPES = {
  WORKSTATION: 'workstation',
  MATERIAL: 'material',
  BUFFER: 'buffer',
  PATH: 'path',
  BOUNDARY: 'boundary',
  INPUT_ZONE: 'input_zone',
  OUTPUT_ZONE: 'output_zone'
};

/**
 * 主题视图配置
 */
export const VIEW_THEMES = {
  all: {
    name: '全部',
    layers: ['workstation', 'material', 'buffer', 'path']
  },
  production: {
    name: '生产视图',
    layers: ['workstation', 'material', 'path']
  },
  buffer: {
    name: '缓冲区视图',
    layers: ['buffer', 'material', 'path']
  }
};

