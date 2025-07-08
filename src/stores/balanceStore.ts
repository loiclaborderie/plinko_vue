import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBalanceStore = defineStore('balance', () => {
  const balance = ref<number | null>(null)

  function initializeBalance(startingBalance: number) {
    balance.value = startingBalance
  }

  function add(amount: number) {
    if (!balance.value) {
      throw new Error('balance is not initialized')
    }
    balance.value += amount
  }

  function subtract(amount: number) {
    if (!balance.value) {
      throw new Error('balance is not initialized')
    }
    if (balance.value < amount) {
      throw new Error('balance is not insufficient')
    }
    balance.value -= amount
  }

  return {
    balance,
    add,
    subtract,
    initializeBalance,
  }
})
