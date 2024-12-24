<script setup lang="ts">
import { usePlinkoCanvas } from '@/composables/usePlinkoCanvas'
import { possibleRows, widthOfTilesContainer, riskLevels } from '@/constants/plinko'
import { usePlinkoStore } from '@/stores/plinkoStore'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, useTemplateRef, watch, type Ref } from 'vue'
import { ROW_REWARDS } from '@/constants/plinko'

const canvas = useTemplateRef('plinkoGame')
const canvasStore = usePlinkoCanvas()
const gameStore = usePlinkoStore()
const { maxRows, sampleResults, obstacles, risk: riskSelected, gameActive } = storeToRefs(gameStore)
const earningTiles = computed(() => ROW_REWARDS[maxRows.value][riskSelected.value])

onMounted(() => {
  console.log(canvas)
  if (canvas.value) {
    canvasStore.initialize(canvas.value)
    canvasStore.update()
  }
})

onUnmounted(() => {
  canvasStore.stop()
})

watch(
  () => maxRows.value,
  () => {
    console.log('reinit', sampleResults)
    canvasStore.stop()
    canvasStore.initialize((canvas as Ref<HTMLCanvasElement>).value)
    canvasStore.update()
    console.log('earningTiles', earningTiles)
  },
)
</script>

<template>
  <div class="container">
    <div class="leftSide">
      <button @click="gameStore.addBall">Bet</button>
      <select v-model="maxRows" :disabled="gameActive">
        <option :key="row" v-for="row in possibleRows" :value="row">
          {{ row }}
        </option>
      </select>
      <select v-model="riskSelected" :disabled="gameActive">
        <option :key="risk" v-for="risk in riskLevels" :value="risk">
          {{ risk }}
        </option>
      </select>
      <button @click="gameStore.simulate">Simulate</button>
    </div>
    <div class="rightSide">
      <div class="relative-container">
        <canvas ref="plinkoGame"></canvas>
        <div class="abs">
          <div
            id="results"
            v-if="earningTiles.length && obstacles.length"
            :style="{
              '--columns': earningTiles.length,
              '--gap': `${obstacles[0].radius}px`,
              width: widthOfTilesContainer[maxRows],
            }"
          >
            <div
              :id="`tile_${index}`"
              :key="index"
              v-for="(tile, index) in earningTiles"
              class="earningTile"
            >
              <span>{{ tile }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {{ sampleResults }}
</template>

<style scoped>
canvas {
  background: #333;
  width: 100%;
  object-fit: contain;
  max-height: 800px;
}

#results {
  --columns: 15;
  --gap: 1%;
  margin: 0 auto;
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-gap: var(--gap);
}

.earningTile {
  position: relative;
  cursor: help;
  border-radius: 0.3em;
  text-align: center;
  animation-duration: 0.3s !important;
  animation-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
  box-shadow: 0 0.2em 0 0 #a60000;
  background: orangered;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: clamp(0.5em, 1.25vw, 1em);
  padding-block: clamp(0.15rem, 0.2vh, 1rem);
  span {
    font-size: 0.75em;
  }
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

.relative-container {
  margin: 50px auto 0;
  width: 100%;
  max-width: 800px;
  position: relative;
  .abs {
    position: absolute;
    left: 0;
    right: 0;
    background: blue;
  }
}
</style>
