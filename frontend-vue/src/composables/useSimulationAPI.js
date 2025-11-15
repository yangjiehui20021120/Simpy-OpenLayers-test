import axios from 'axios'

const baseURL = import.meta.env.DEV ? 'http://localhost:8000' : ''

const api = axios.create({
  baseURL,
  timeout: 10000
})

export function useSimulationAPI() {
  const startSimulation = async (duration = 100) => {
    const response = await api.post(`/api/simulation/start?duration=${duration}`)
    return response.data
  }

  const stopSimulation = async () => {
    const response = await api.post('/api/simulation/stop')
    return response.data
  }

  const fetchStatistics = async () => {
    const response = await api.get('/api/simulation/status')
    return response.data
  }

  const fetchWorkshopLayout = async () => {
    const response = await api.get('/api/workshop-layout')
    return response.data
  }

  return {
    startSimulation,
    stopSimulation,
    fetchStatistics,
    fetchWorkshopLayout
  }
}

