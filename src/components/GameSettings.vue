<template>
  <Card class="w-full max-w-sm bg-card/90 backdrop-blur-sm border-border">
    <CardHeader>
      <CardTitle class="text-lg font-bold text-center text-foreground">
        Game Settings
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Risk Level Selector -->
      <div class="space-y-2">
        <Label for="risk-level" class="text-sm font-medium">Risk Level</Label>
        <Select v-model="riskSelected" :disabled="gameActive">
          <SelectTrigger class="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent class="bg-popover border-border">
            <SelectItem v-for="risk of riskLevels" :value="risk" :key="risk" class="cursor-pointer">
              <div class="flex items-center space-x-2">
                <component :is="riskLevelIcons[risk]" class="w-4 h-4" :class="riskLevelColors[risk]" />
                <span>{{ capitalize(risk) }} Level</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Columns Selector -->
      <div class="space-y-2">
        <Label for="columns" class="text-sm font-medium">Columns</Label>
        <Select v-model="maxRows" :disabled="gameActive">
          <SelectTrigger class="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent class="bg-popover border-border">
            <SelectItem v-for="num in possibleRows" :key="num" :value="num" class="cursor-pointer">
              {{ num }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Wager Amount Input -->
      <div class="space-y-2">
        <Label for="wager" class="text-sm font-medium">Wager Amount</Label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="wager"
            type="number"
            min="0.01"
            step="0.01"
            v-model.number="wagerAmount"
            class="pl-7 bg-secondary border-border"
            placeholder="0.00"
          />
        </div>
      </div>

      <!-- Drop Ball Button -->
      <Button
        @click="bet"
        class="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 shadow-md"
      >Bet</Button>

      <!-- Game Info Section -->
      <div class="bg-secondary/50 p-3 rounded-lg border border-border">
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
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Dice1, TrendingUp, Zap } from 'lucide-vue-next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { possibleRows, riskLevels } from '@/constants/plinko'
import { usePlinkoStore } from '@/stores/plinkoStore';
import { storeToRefs } from 'pinia';
import { PlinkoGameManager } from '@/classes/plinkoGameManager';
import { ROW_REWARDS } from '@/constants/plinko'

const gameStore = usePlinkoStore()

const { maxRows, risk: riskSelected, gameActive } = storeToRefs(gameStore)
const earningTiles = computed(() => ROW_REWARDS[maxRows.value][riskSelected.value])


console.log('gamde defaults', maxRows.value, riskSelected.value)

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

const capitalize = (str: string) => {
  if (!str.length) return "";  // Check if the string is empty or undefined
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const bet = () => {
  const game = new PlinkoGameManager()
  game.requestGame(wagerAmount.value)
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
