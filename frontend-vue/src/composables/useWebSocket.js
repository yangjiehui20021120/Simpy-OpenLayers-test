import { ref } from 'vue'

let ws = null
let messageCallback = null

export function useWebSocket() {
  const isConnected = ref(false)

  const connect = () => {
    // 根据当前协议自动选择 ws 或 wss
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = import.meta.env.DEV ? 'localhost:8000' : window.location.host
    const wsUrl = `${protocol}//${host}/ws`
    
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('WebSocket connected')
      isConnected.value = true
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (messageCallback) {
        messageCallback(message)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      isConnected.value = false
    }
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
    }
  }

  const onMessage = (callback) => {
    messageCallback = callback
  }

  return {
    isConnected,
    connect,
    disconnect,
    onMessage
  }
}

