import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useBalanceStore } from './balanceStore'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const user = ref<any | null>(null)
  const isConnected = ref(false)
  const balanceStore = useBalanceStore()

  async function checkAuthStatus() {
    try {
      const response = await axios.get('/api/user')
      isConnected.value = true
      user.value = response.data

      // Initialize balance when user is authenticated
      if (response.data.coins !== undefined) {
        balanceStore.initializeBalance(response.data.coins)
      }

    } catch (error: any) {
      if (error.response?.status === 401) {
        isConnected.value = false
        user.value = null
        balanceStore.resetBalance() // Clear balance on auth failure
      }
    }
  }

  async function logout() {
    try {
      await axios.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear state
      isConnected.value = false
      user.value = null
      balanceStore.resetBalance() // Clear balance on logout
    }
  }

  return {
    isConnected,
    user,
    checkAuthStatus,
    logout
  }
})
