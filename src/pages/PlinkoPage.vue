<template>
  <div class="container mx-auto px-4 max-w-7xl">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Game Settings Sidebar -->
      <div class="lg:col-span-1 order-2 lg:order-1">
        <GameSettings />
      </div>

      <!-- Plinko Board -->
      <div class="lg:col-span-3 order-1 lg:order-2">
        <PlinkoCanva />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlinkoCanva from '@/components/PlinkoCanva.vue'
import GameSettings from '@/components/GameSettings.vue'

</script>

