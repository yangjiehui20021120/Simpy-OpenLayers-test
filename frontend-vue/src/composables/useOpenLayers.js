import { ref } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import { Vector as VectorLayer, Image as ImageLayer } from 'ol/layer'
import { Vector as VectorSource, ImageStatic } from 'ol/source'
import { Circle, Fill, Stroke, Style, Text, RegularShape } from 'ol/style'
import { Point, Polygon, LineString } from 'ol/geom'
import Feature from 'ol/Feature'
import { Projection } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON'
import { ScaleLine, defaults as defaultControls } from 'ol/control'
import { useSimulationAPI } from './useSimulationAPI'
import { MAP_LAYERS_CONFIG, getActiveRegion, getCurrentLevel } from '../config/mapLayers'

let map = null
let vectorSource = null
let partsLayer = null
let workshopLayer = null
let partFeatures = {}
let layersRef = {}
let currentLevel = 'OVERVIEW'
let activeRegion = null
let currentZoom = 2

export function useOpenLayers() {
  const { fetchWorkshopLayout } = useSimulationAPI()

  // 初始化地图
  const initMap = async (container, layerVisibility = {}) => {
    const extent = [0, 0, 120, 40]
    const projection = new Projection({
      code: 'WORKSHOP',
      units: 'meters',
      extent: extent
    })

    // === 创建底图层 ===
    // 图片底图层（可选，如果有图片底图）
    const baseImageLayer = new ImageLayer({
      source: new ImageStatic({
        url: '/map_image.png',  // 如果有底图图片
        imageExtent: extent,
        projection: projection
      }),
      opacity: 0.5,
      visible: true,
      zIndex: 0
    })

    // === 创建矢量图层 ===
    // 1. 边界图层
    const boundaryLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: '#333',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.1)'
        })
      }),
      zIndex: 2,
      visible: layerVisibility.boundary !== false
    })

    // 2. 工位图层
    const workstationLayer = new VectorLayer({
      source: new VectorSource(),
      style: (feature) => {
        const status = feature.get('status') || 'idle'
        return new Style({
          image: new Circle({
            radius: 12,
            fill: new Fill({
              color: status === 'busy' ? '#52c41a' : '#d9d9d9'
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 2
            })
          }),
          text: new Text({
            text: feature.get('name'),
            offsetY: -20,
            font: '12px sans-serif',
            fill: new Fill({ color: '#333' }),
            stroke: new Stroke({
              color: '#fff',
              width: 3
            })
          })
        })
      },
      zIndex: 10,
      visible: layerVisibility.workstation !== false
    })

    // 3. 缓冲区图层
    const bufferLayer = new VectorLayer({
      source: new VectorSource(),
      style: (feature) => {
        return new Style({
          image: new RegularShape({
            fill: new Fill({ color: '#faad14' }),
            stroke: new Stroke({
              color: '#fff',
              width: 2
            }),
            points: 4,
            radius: 10,
            angle: Math.PI / 4
          }),
          text: new Text({
            text: `${feature.get('level') || 0}/${feature.get('capacity')}`,
            offsetY: -18,
            font: '10px sans-serif',
            fill: new Fill({ color: '#333' }),
            stroke: new Stroke({
              color: '#fff',
              width: 2
            })
          })
        })
      },
      zIndex: 11,
      visible: layerVisibility.buffer !== false
    })

    // 4. 路径图层
    const pathLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: '#bfbfbf',
          width: 3,
          lineDash: [10, 5]
        })
      }),
      zIndex: 3,
      visible: layerVisibility.path !== false
    })

    // 5. 输入/输出区域图层
    const zoneLayer = new VectorLayer({
      source: new VectorSource(),
      style: (feature) => {
        const type = feature.get('type')
        if (type === 'input_zone') {
          return new Style({
            fill: new Fill({
              color: 'rgba(24, 144, 255, 0.1)'
            }),
            stroke: new Stroke({
              color: '#1890ff',
              width: 1,
              lineDash: [5, 5]
            }),
            text: new Text({
              text: feature.get('name'),
              font: '11px sans-serif',
              fill: new Fill({ color: '#1890ff' })
            })
          })
        } else if (type === 'output_zone') {
          return new Style({
            fill: new Fill({
              color: 'rgba(82, 196, 26, 0.1)'
            }),
            stroke: new Stroke({
              color: '#52c41a',
              width: 1,
              lineDash: [5, 5]
            }),
            text: new Text({
              text: feature.get('name'),
              font: '11px sans-serif',
              fill: new Fill({ color: '#52c41a' })
            })
          })
        }
        return null
      },
      zIndex: 4,
      visible: layerVisibility.zone !== false
    })

    // 6. 物料图层
    vectorSource = new VectorSource()
    partsLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const status = feature.get('status')
        let color = '#1890ff'

        if (status === 'processing') {
          color = '#52c41a'
        } else if (status === 'finished') {
          color = '#722ed1'
        }

        return new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: color }),
            stroke: new Stroke({
              color: '#fff',
              width: 2
            })
          }),
          text: new Text({
            text: feature.get('part_id'),
            offsetY: -15,
            font: '10px sans-serif',
            fill: new Fill({ color: '#333' }),
            stroke: new Stroke({
              color: '#fff',
              width: 2
            })
          })
        })
      },
      zIndex: 20,
      visible: layerVisibility.material !== false
    })

    // 7. 区域边界图层（用于缩放分层显示）
    const regionBoundaryLayer = new VectorLayer({
      source: new VectorSource(),
      style: (feature) => {
        return new Style({
          stroke: new Stroke({ 
            color: '#0066ff', 
            width: 3,
            lineDash: [10, 5]
          }),
          fill: new Fill({ 
            color: 'rgba(0, 102, 255, 0.1)' 
          }),
          text: new Text({
            text: feature.get('name'),
            font: 'bold 14px sans-serif',
            fill: new Fill({ color: '#0066ff' }),
            stroke: new Stroke({ color: '#fff', width: 3 }),
            offsetY: -10
          })
        })
      },
      visible: false,
      zIndex: 5
    })

    // 添加区域边界要素
    MAP_LAYERS_CONFIG.levels.REGION.regions.forEach(region => {
      const [minX, minY, maxX, maxY] = region.bounds
      const boundaryFeature = new Feature({
        geometry: new Polygon([[
          [minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY], [minX, minY]
        ]]),
        name: region.name,
        regionId: region.id
      })
      regionBoundaryLayer.getSource().addFeature(boundaryFeature)
    })

    // 保存所有图层引用
    layersRef = {
      baseImage: baseImageLayer,
      boundary: boundaryLayer,
      workstation: workstationLayer,
      buffer: bufferLayer,
      path: pathLayer,
      zone: zoneLayer,
      material: partsLayer,
      regionBoundary: regionBoundaryLayer
    }

    // 保存 workshopLayer 引用（用于向后兼容）
    workshopLayer = boundaryLayer

    // 创建视图
    const view = new View({
      center: [60, 20],
      zoom: 2,
      projection: projection,
      maxZoom: 5,
      minZoom: 0.5
    })

    // 创建地图
    map = new Map({
      target: container,
      layers: [
        baseImageLayer,
        boundaryLayer,
        regionBoundaryLayer,
        pathLayer,
        zoneLayer,
        workstationLayer,
        bufferLayer,
        partsLayer
      ],
      view: view,
      controls: defaultControls().extend([
        new ScaleLine()
      ])
    })

    // 监听地图容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      map.updateSize()
    })
    resizeObserver.observe(container)

    // 监听缩放变化，实现缩放分层
    view.on('change:resolution', () => {
      const zoom = view.getZoom()
      const center = view.getCenter()
      
      currentZoom = zoom
      
      // 根据zoom级别切换图层
      const level = getCurrentLevel(zoom)
      currentLevel = level
      
      // 显示/隐藏区域边界
      const showRegions = zoom > MAP_LAYERS_CONFIG.zoomThresholds.showRegions
      layersRef.regionBoundary.setVisible(showRegions)
      
      // 根据缩放级别调整底图透明度
      if (zoom > MAP_LAYERS_CONFIG.zoomThresholds.hideOverview) {
        smoothOpacityChange(layersRef.baseImage, 0.3)
      } else {
        smoothOpacityChange(layersRef.baseImage, 0.5)
      }
      
      // 判断当前在哪个区域（详细视图）
      if (zoom > MAP_LAYERS_CONFIG.zoomThresholds.showDetails) {
        const region = getActiveRegion(zoom, center)
        activeRegion = region
      } else {
        activeRegion = null
      }
    })

    // 自适应缩放
    setTimeout(() => {
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 1000
      })
    }, 100)

    // 加载车间布局
    await loadWorkshopLayout()
  }

  // 平滑改变图层透明度
  const smoothOpacityChange = (layer, targetOpacity, duration = 300) => {
    const currentOpacity = layer.getOpacity()
    const steps = 20
    const stepDuration = duration / steps
    const opacityStep = (targetOpacity - currentOpacity) / steps
    
    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const newOpacity = currentOpacity + (opacityStep * currentStep)
      layer.setOpacity(Math.max(0, Math.min(1, newOpacity)))
      
      if (currentStep >= steps) {
        clearInterval(interval)
        layer.setOpacity(targetOpacity)
      }
    }, stepDuration)
  }

  // 加载车间布局
  const loadWorkshopLayout = async () => {
    try {
      const geojson = await fetchWorkshopLayout()
      const features = new GeoJSON().readFeatures(geojson)
      
      // 根据要素类型分配到不同图层
      features.forEach(feature => {
        const type = feature.get('type')
        if (type === 'boundary') {
          layersRef.boundary.getSource().addFeature(feature)
        } else if (type === 'workstation') {
          layersRef.workstation.getSource().addFeature(feature)
        } else if (type === 'buffer') {
          layersRef.buffer.getSource().addFeature(feature)
        } else if (type === 'path') {
          layersRef.path.getSource().addFeature(feature)
        } else if (type === 'input_zone' || type === 'output_zone') {
          layersRef.zone.getSource().addFeature(feature)
        } else {
          // 默认添加到边界层
          layersRef.boundary.getSource().addFeature(feature)
        }
      })

      console.log('车间布局加载完成')
    } catch (error) {
      console.error('Failed to load workshop layout:', error)
    }
  }

  // 设置图层可见性
  const setLayerVisibility = (layerName, visible) => {
    if (layersRef[layerName]) {
      layersRef[layerName].setVisible(visible)
    }
  }

  // 设置底图（支持图片URL）
  const setBaseMap = (imageUrl) => {
    if (layersRef.baseImage && imageUrl) {
      const extent = map.getView().getProjection().getExtent()
      layersRef.baseImage.setSource(new ImageStatic({
        url: imageUrl,
        imageExtent: extent,
        projection: map.getView().getProjection()
      }))
    }
  }

  // 处理仿真事件
  const handleSimulationEvent = (event) => {
    const { type, data } = event

    switch(type) {
      case 'part_arrived':
        createPartFeature(data)
        break

      case 'part_queue':
      case 'part_waiting_buffer':
      case 'part_in_buffer':
        updatePartPosition(data)
        break

      case 'part_processing':
        updatePartPosition(data)
        updateWorkstationStatus(data.workstation_id, 'busy')
        break

      case 'part_completed_station':
        updatePartPosition(data)
        updateWorkstationStatus(data.workstation_id, 'idle')
        break

      case 'part_finished':
        updatePartPosition(data)
        setTimeout(() => removePartFeature(data.part_id), 2000)
        break
    }
  }

  // 创建物料要素
  const createPartFeature = (data) => {
    const { part_id, position } = data

    const feature = new Feature({
      geometry: new Point(position),
      part_id: part_id,
      status: 'arrived'
    })

    vectorSource.addFeature(feature)
    partFeatures[part_id] = feature
  }

  // 更新物料位置
  const updatePartPosition = (data) => {
    const { part_id, position, status } = data
    const feature = partFeatures[part_id]

    if (feature) {
      const geometry = feature.getGeometry()
      const currentPos = geometry.getCoordinates()

      // 平滑动画移动
      animateMove(feature, currentPos, position, 500)

      feature.set('status', status)
    }
  }

  // 平滑移动动画
  const animateMove = (feature, start, end, duration) => {
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 缓动函数
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const x = start[0] + (end[0] - start[0]) * easeProgress
      const y = start[1] + (end[1] - start[1]) * easeProgress

      feature.getGeometry().setCoordinates([x, y])

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  // 移除物料要素
  const removePartFeature = (partId) => {
    const feature = partFeatures[partId]
    if (feature) {
      vectorSource.removeFeature(feature)
      delete partFeatures[partId]
    }
  }

  // 更新工位状态
  const updateWorkstationStatus = (workstationId, status) => {
    const features = layersRef.workstation.getSource().getFeatures()
    const workstation = features.find(f =>
      f.get('type') === 'workstation' && f.get('id') === workstationId
    )

    if (workstation) {
      workstation.set('status', status)
      workstation.changed()
    }
  }

  // 清空物料
  const clearParts = () => {
    vectorSource.clear()
    partFeatures = {}
  }

  // 重置工位状态
  const resetWorkstations = () => {
    const features = layersRef.workstation.getSource().getFeatures()
    features.forEach(f => {
      if (f.get('type') === 'workstation') {
        f.set('status', 'idle')
        f.changed()
      }
    })
  }

  // 获取当前层级信息
  const getCurrentLevelInfo = () => {
    return {
      level: currentLevel,
      region: activeRegion,
      zoom: currentZoom
    }
  }

  return {
    initMap,
    handleSimulationEvent,
    clearParts,
    resetWorkstations,
    setLayerVisibility,
    setBaseMap,
    getCurrentLevelInfo,
    layersRef: () => layersRef,
    map: () => map
  }
}

