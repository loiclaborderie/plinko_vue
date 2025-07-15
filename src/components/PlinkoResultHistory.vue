<template>
    <div v-if="resultStore.currentResults.length" class="rounded-2xl shadow-lg border border-orange-300/20 overflow-hidden w-16">
      <div
        v-for="(multiplier, index) in resultStore.currentResults"
        :key="`${multiplier}-${index}`"
        :style="{
          backgroundColor: multiplierColors[multiplier]
        }"
        :class="[
          'h-14 flex items-center justify-center relative transition-all duration-500 ease-out',
          index !== 0 ? 'border-t border-border/30' : '',
          index === resultStore.currentResults.length - 1 ? 'animate-slide-in-from-bottom' : ''
        ]"
      >
        <span class="text-black font-bold text-lg relative z-10">{{ multiplier }}x</span>
      </div>
    </div>
</template>

<script setup lang="ts">
import { usePlinkoTileColors } from '@/composables/usePlinkoTileColors'
import { ROW_REWARDS } from '@/constants/plinko'
import { useGameResultStore } from '@/stores/gameResultStore'
import { usePlinkoStore } from '@/stores/plinkoStore'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
const resultStore = useGameResultStore()
const gameStore = usePlinkoStore()
const { maxRows, risk } = storeToRefs(gameStore)




resultStore.ongoingGame = 'plinko'

watch([maxRows, risk], () => {
  resultStore.resetCurrentGameResults()
})

const plinkoColors = usePlinkoTileColors()

const multipliers = computed(() => ROW_REWARDS[maxRows.value][risk.value]);

const multiplierColors = computed(() => {
  const map: Record<number | string, string> = {};
  multipliers.value.forEach((val, i) => {
    map[val] = plinkoColors.value[i]; // keeps the last occurrence
  });
  return map;
});
</script>

<style scoped>
@keyframes slide-in-from-bottom {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-in-from-bottom {
  animation: slide-in-from-bottom 0.3s ease-in-out;
}
</style>
