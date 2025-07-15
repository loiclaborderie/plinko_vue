<template>
  <div class="space-y-2">
    <Label for="risk-level" class="text-sm font-medium">Risk Level</Label>
    <Select v-model="risk" :disabled="disabled">
      <SelectTrigger class="!bg-slate-900 border-slate-600 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent class="bg-popover border-border">
        <SelectItem v-for="r in riskLevels" :value="r" :key="r" class="cursor-pointer">
          <div class="flex items-center space-x-2">
            <component :is="riskLevelIcons[r]" class="w-4 h-4" :class="riskLevelColors[r]" />
            <span>{{ capitalize(r) }} Level</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>

    <Label for="columns" class="text-sm font-medium mt-4">Columns</Label>
    <Select v-model="columns" :disabled="disabled">
      <SelectTrigger class="!bg-slate-900 border-slate-600 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent class="bg-popover border-border">
        <SelectItem v-for="n in possibleRows" :key="n" :value="n" class="cursor-pointer">
          {{ n }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { riskLevels, possibleRows, type Risk } from '@/constants/plinko'
import { Dice1, TrendingUp, Zap } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

defineProps<{
  disabled: boolean
}>()

const risk = defineModel<Risk>('risk')
const columns = defineModel<number>('columns')

const riskLevelIcons = { low: Dice1, medium: TrendingUp, high: Zap }
const riskLevelColors = { low: 'text-green-400', medium: 'text-yellow-400', high: 'text-red-400' }

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
</script>
