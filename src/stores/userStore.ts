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
    const response = await axios.get('/api/user');
    isConnected.value = true;
    user.value = response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      isConnected.value = false;
      user.value = null;
    }
  }
}

  return {
    user,
    isConnected,
    checkAuthStatus
  }
})
