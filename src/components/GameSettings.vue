<template>
  <BettingInterface v-model:wager-amount="wagerAmount">
    <template #manualButtons>
      <RiskAndColumns v-model:risk="riskSelected" v-model:columns="maxRows" :disabled="gameActive" />

      <Button :disabled="wagerAmount && !balanceStore.canAfford(wagerAmount)" @click="bet" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 shadow-md rounded-md">Bet</Button>

      <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-600">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Risk:</span>
          <div :class="['flex items-center space-x-1', riskLevelColors[riskSelected]]">
            <component :is="riskLevelIcons[riskSelected]" class="w-4 h-4" />
            <span class="capitalize font-medium">{{ capitalize(riskSelected) }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between text-sm mt-1">
          <span class="text-muted-foreground">Potential Win:</span>
          <span class="text-plinko-gold font-medium">
            {{ potentialEarnings }}
          </span>
        </div>
      </div>
    </template>
    <template #autoButtons>
      <RiskAndColumns v-model:risk="riskSelected" v-model:columns="maxRows" :disabled="gameActive" />

      <div class="space-y-4">
        <Label class="text-slate-300 text-sm">Number of bets</Label>
        <InputAutoBet v-model="numberOfBets" />
      </div>

      <Button @click="triggerAutoBet" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 shadow-md rounded-md" :disabled="!isAutobet && !canAffordAutoBet">{{ isAutobet ? 'Stop' : 'Start' }} autobet</Button>

      <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-600">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Risk:</span>
          <div :class="['flex items-center space-x-1', riskLevelColors[riskSelected]]">
            <component :is="riskLevelIcons[riskSelected]" class="w-4 h-4" />
            <span class="capitalize font-medium">{{ capitalize(riskSelected) }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between text-sm mt-1">
          <span class="text-muted-foreground">Potential Win:</span>
          <span class="text-plinko-gold font-medium">
            {{ potentialEarnings }}
          </span>
        </div>
      </div>
    </template>
  </BettingInterface>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Dice1, TrendingUp, Zap } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { usePlinkoStore } from '@/stores/plinkoStore';
import { storeToRefs } from 'pinia';
import { PlinkoGameManager } from '@/classes/plinkoGameManager';
import { ROW_REWARDS } from '@/constants/plinko'
import BettingInterface from './BettingInterface.vue';
import InputAutoBet from './InputAutoBet.vue';
import RiskAndColumns from './plinko/riskAndColumns.vue';
import { toast } from 'vue-sonner';
import { useBalanceStore } from '@/stores/balanceStore';
import { useSoundStore } from '@/stores/soundStore';
const balanceStore = useBalanceStore()
const soundStore = useSoundStore()

const gameStore = usePlinkoStore()

const { maxRows, risk: riskSelected, gameActive } = storeToRefs(gameStore)
const earningTiles = computed(() => ROW_REWARDS[maxRows.value][riskSelected.value])

const isAutobet = ref(false)


const riskLevelIcons = {
  low: Dice1,
  medium: TrendingUp,
  high: Zap
};

const riskLevelColors = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-red-400'
};

const biggestMultiplier = computed(() => earningTiles.value[0])

const potentialEarnings = computed(()=>{
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(wagerAmount.value * biggestMultiplier.value);
  return formattedAmount
})

const wagerAmount = ref(0);
const numberOfBets = ref(0);

const capitalize = (str: string) => {
  if (!str.length) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const bet = async() => {
  const game = new PlinkoGameManager()
  try {
    await game.requestGame(wagerAmount.value)
    soundStore.playSound('bet')
  } catch (e: any){
    console.error('error, couldnt proceed with bet', e)
    toast.error('Failed to place bet', { description: e.message || 'Please try again' })

  }
}

const triggerAutoBet = () => {
  isAutobet.value = !isAutobet.value
  if(isAutobet.value === true && !canAffordAutoBet.value){
    isAutobet.value = false
    toast.error('Insufficient balance for autobet')
    return
  }
  autobet()
}

const canAffordAutoBet = computed(()=>{
  if(wagerAmount.value === 0) return true
  if(numberOfBets.value === 0) return balanceStore.canAfford(wagerAmount.value)
  return balanceStore.canAfford(wagerAmount.value * numberOfBets.value)
})

const autobet = async () => {
  if(!isAutobet.value) {
    toast.error('Autobet stopped')
    return
  }
  toast.success('Autobet started')
  let numberOfBetsLeft = numberOfBets.value || Number.POSITIVE_INFINITY
  const game = new PlinkoGameManager()
  while(isAutobet.value && numberOfBetsLeft > 0){
    try {
      await game.requestGame(wagerAmount.value)
      if(numberOfBetsLeft === numberOfBets.value){
        // the first bet has been approved, we can play sound
        soundStore.playSound('bet')
      }
      numberOfBetsLeft--
    } catch (e: any){
      isAutobet.value = false
      console.error('error, autobet stopped', e)
      toast.error('Autobet stopped', { description: e.message || 'An error occurred' })
      return
    }
  }
  isAutobet.value = false
}
</script>

<style scoped></style>
