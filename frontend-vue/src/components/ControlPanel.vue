<template>
  <div class="panel">
    <h3>⚙️ 仿真控制</h3>

    <label class="input-label">
      仿真时长（秒）:
      <input 
        v-model.number="duration" 
        type="number" 
        class="duration-input" 
        min="10" 
        max="1000" 
        step="10"
      >
    </label>

    <div class="controls">
      <button 
        class="btn-primary" 
        :disabled="isRunning"
        @click="handleStart"
      >
        ▶️ 开始仿真
      </button>
      <button 
        class="btn-danger" 
        :disabled="!isRunning"
        @click="handleStop"
      >
        ⏹️ 停止
      </button>
    </div>

    <div style="margin-top: 10px; padding: 10px; background: #f0f2f5; border-radius: 4px; font-size: 13px;">
      <span 
        class="status-indicator" 
        :class="isRunning ? 'status-running' : 'status-stopped'"
      ></span>
      <span>{{ statusText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isRunning: {
    type: Boolean,
    default: false
  },
  statusText: {
    type: String,
    default: '就绪'
  }
})

const emit = defineEmits(['start', 'stop'])

const duration = ref(100)

const handleStart = () => {
  emit('start', duration.value)
}

const handleStop = () => {
  emit('stop')
}
</script>

