<template>
    User: {{ userStore.user }}
  <header>
    <h1>Plinko</h1>
  </header>

  <main>
    <PlinkoCanva />
    Balance:
    <span style="font-size: xx-large; font-weight: 900">{{ balanceStore.balance ?? 0 }}</span>
  </main>

</template>

<script setup lang="ts">
import PlinkoCanva from '@/components/PlinkoCanva.vue'
import { useBalanceStore } from '@/stores/balanceStore'
import { useUserStore } from '@/stores/userStore'

const balanceStore = useBalanceStore()
const userStore = useUserStore()
</script>


<style scoped>
h1 {
  text-align: center;
  font-weight: 900;
  font-size: 40px;
}
</style>

