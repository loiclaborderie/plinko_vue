import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useBalanceStore } from './balanceStore'

export const useUserStore = defineStore('user', () => {
  const user = ref<{ id: number; name: string; coins: number } | null>(null)
  const isConnected = ref(false)
  const balanceStore = useBalanceStore()
  const token = ref<string | null>(null)

  function connect(userData: { id: number; name: string; coins: number }, apiToken: string) {
    user.value = userData
    token.value = apiToken
    isConnected.value = true
    balanceStore.initializeBalance(userData.coins)
  }

  function disconnect() {
    user.value = null
    isConnected.value = false
    balanceStore.initializeBalance(0)
    token.value = null
  }

  return {
    user,
    isConnected,
    connect,
    token,
    disconnect,
  }
})
