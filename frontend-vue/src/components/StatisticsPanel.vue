<template>
  <div class="panel">
    <h3>📊 实时统计</h3>
    <div class="stat-grid">
      <div class="stat-item">
        <div class="stat-label">已生产</div>
        <div class="stat-value">
          {{ statistics.parts_produced }}
          <span class="stat-unit">件</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label">在制品</div>
        <div class="stat-value">
          {{ statistics.parts_in_system }}
          <span class="stat-unit">件</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label">产能</div>
        <div class="stat-value">
          {{ statistics.throughput.toFixed(3) }}
          <span class="stat-unit">件/秒</span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label">周期时间</div>
        <div class="stat-value">
          {{ statistics.avg_cycle_time.toFixed(2) }}
          <span class="stat-unit">秒</span>
        </div>
      </div>
    </div>

    <h3 style="margin-top: 20px;">🔧 工位利用率</h3>
    <div id="workstationStats">
      <div 
        v-for="(util, index) in statistics.workstation_utilization" 
        :key="index"
        class="workstation-status"
      >
        <div class="workstation-name">{{ workstationNames[index] }}</div>
        <div class="workstation-util">利用率: {{ (util * 100).toFixed(1) }}%</div>
        <div class="utilization-bar">
          <div class="utilization-fill" :style="{ width: (util * 100) + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  statistics: {
    type: Object,
    default: () => ({
      parts_produced: 0,
      parts_in_system: 0,
      throughput: 0,
      avg_cycle_time: 0,
      workstation_utilization: Array(9).fill(0)
    })
  }
})

const workstationNames = [
  '工位1-预处理',
  '工位2-粗加工A',
  '工位3-粗加工B',
  '工位4-精加工A',
  '工位5-精加工B',
  '工位6-组装',
  '工位7-质检A',
  '工位8-质检B',
  '工位9-包装'
]
</script>

