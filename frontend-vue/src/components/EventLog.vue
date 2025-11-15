<template>
  <div class="panel" style="display: flex; flex-direction: column;">
    <h3>📝 事件日志</h3>
    <div class="log-container">
      <div 
        v-for="(log, index) in events" 
        :key="index"
        class="log-entry"
      >
        <span class="log-time">[{{ log.time }}]</span>
        <span class="log-type">{{ log.type }}</span>
        <span>{{ log.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  events: {
    type: Array,
    default: () => []
  }
})
</script>

