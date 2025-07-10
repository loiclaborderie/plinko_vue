import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useBalanceStore = defineStore('balance', () => {
  const REFILL_AMOUNT = 1000
  const balance = ref<number | null>(null)
  const isLoading = ref(false)
  const lastSyncTime = ref<Date | null>(null)

  // Computed to check if balance is initialized
  const isInitialized = computed(() => balance.value !== null)

  // Initialize balance from user data
  function initializeBalance(startingBalance: number) {
    balance.value = startingBalance
    lastSyncTime.value = new Date()
  }

  // Reset balance (for logout)
  function resetBalance() {
    balance.value = null
    lastSyncTime.value = null
  }

  // Optimistic update with background sync
  async function updateBalance(amount: number) {
    if (!isInitialized.value) {
      throw new Error('Balance is not initialized')
    }

    const newBalance = balance.value! + amount

    // Check for insufficient funds
    if (newBalance < 0) {
      throw new Error('Insufficient balance')
    }

    // Store original balance for rollback
    const originalBalance = balance.value!

    // Optimistic update
    balance.value = newBalance

    try {
      // Background API call to sync with server
      const response = await axios.get('api/user/balance')

      // Update with server response (in case of server-side adjustments)
      balance.value = response.data.balance
      lastSyncTime.value = new Date()

    } catch (error) {
      // Rollback on error
      balance.value = originalBalance
      console.error('Failed to sync balance with server:', error)
      throw new Error('Failed to update balance. Please try again.')
    }
  }

  // Convenience methods
  async function add(amount: number, sync = true) {
    if(sync){
      await addAndSync(amount)
    } else {
      addTemporaryWagerGain(amount)
    }
  }

  async function addAndSync(amount: number) {
    await updateBalance(amount)
  }

  function addTemporaryWagerGain(amount: number) {
    balance.value = balance.value! + amount
  }

  async function subtract(amount: number) {
    return updateBalance(-amount)
  }

  function substractWager(amount: number) : boolean {
    if(!canAfford(amount)){
      console.error('You dont have enough balance')
      return false
    }
    balance.value = balance.value! - amount
    return true
  }

  // Check if balance can cover an amount
  function canAfford(amount: number): boolean {
    return isInitialized.value && balance.value! >= amount
  }

  async function refillBalance(){
    try {
      const response = await axios.post('api/user/balance/refill', {
        amount: REFILL_AMOUNT
      })

      balance.value = response.data.balance
      lastSyncTime.value = new Date()

    } catch (error) {
      console.error('Failed to sync balance with server:', error)
      throw new Error('Failed to update balance. Please try again.')
    }
  }

  return {
    balance,
    isLoading,
    isInitialized,
    lastSyncTime,
    initializeBalance,
    resetBalance,
    add,
    subtract,
    updateBalance,
    canAfford,
    refillBalance,
    substractWager
  }
})
