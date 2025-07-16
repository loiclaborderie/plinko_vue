<template>
  <div class="container mx-auto px-4 max-w-7xl">
    <div class="flex flex-col-reverse md:flex-row items-center md:items-stretch gap-y-4">
      <!-- Game Settings Sidebar -->
      <div id="betSettings" class="min-h-full w-full md:w-[max(35%,_250px)]">
        <GameSettings />
      </div>

      <!-- Plinko Board -->
      <div class="flex-1 w-full">
        <div id="gameContent" class="px-4">
          <PlinkoCanva />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlinkoCanva from '@/components/PlinkoCanva.vue'
import GameSettings from '@/components/GameSettings.vue'
import { useSoundStore, type SoundMap } from '../stores/soundStore'
const soundStore = useSoundStore()

const sounds: SoundMap = {
  'tile': '/sounds/plink.mp3',
  'bet': '/sounds/bet.mp3',
}

soundStore.preloadSounds(sounds)
</script>

<style scoped>
</style>

