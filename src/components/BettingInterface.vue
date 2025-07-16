<script setup lang="ts">
import Tabs from './ui/tabs/Tabs.vue'
import Input from './ui/input/Input.vue'
import TabsTrigger from './ui/tabs/TabsTrigger.vue'
import TabsContent from './ui/tabs/TabsContent.vue'
import TabsList from './ui/tabs/TabsList.vue'
import Label from './ui/label/Label.vue'
import Button from './ui/button/Button.vue'
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'
import { useBalanceStore } from '@/stores/balanceStore'

const balanceStore = useBalanceStore()

const handleHalfBet = () => {
  const current = wagerAmount.value || 0
  wagerAmount.value = Number.parseFloat((current / 2).toFixed(1))
}

const handleDoubleBet = () => {
  const current = wagerAmount.value || 0
  wagerAmount.value = Number.parseFloat((current * 2).toFixed(1))
}

const handleMaxBet = () => {
  if(!balanceStore.balance){
    wagerAmount.value = 0
    return
  }
  wagerAmount.value = Number.parseFloat(balanceStore.balance.toFixed(1))
}

function sanitizeDecimal() {
  if (wagerAmount.value && !isNaN(wagerAmount.value)) {
    wagerAmount.value = parseFloat(wagerAmount.value.toFixed(1))
  }
}

const wagerAmount = defineModel<number>('wagerAmount')
</script>

<template>
  <Card
    class="h-full w-full max-w-sm backdrop-blur-sm border-border bg-slate-800 text-white p-6 rounded-2xl"
  >
    <CardContent>
      <Tabs default-value="manual" class="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-900 mb-6 rounded-full p-[6px]">
          <TabsTrigger
            value="manual"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white rounded-full py-2 px-4"
          >
            Manual
          </TabsTrigger>
          <TabsTrigger
            value="auto"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white rounded-full py-2 px-4"
          >
            Auto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" class="space-y-6">
          <div class="space-y-3">
            <Label class="text-slate-300 text-sm">Bet Amount</Label>
            <div class="flex gap-2 shadow-2xl bg-slate-700 p-[2px] border rounded-md">
              <Input
                type="number"
                v-model.number="wagerAmount"
                @input="sanitizeDecimal"
                min="0"
                step="0.1"
                class="!bg-slate-900 border-slate-600 text-white pr-12 no-spinner"
              />
              <div class="flex gap-1 items-center">
                <Button
                  class="bg-transparent text-white hover:bg-slate-600 px-3"
                  @click="handleHalfBet"
                >
                  ½
                </Button>
                <div class="block h-6 bg-border w-px" />

                <Button
                  class="bg-transparent text-white hover:bg-slate-600 px-3"
                  @click="handleDoubleBet"
                >
                  2×
                </Button>
                <div class="block h-6 bg-border w-px" />
                <Button
                  class="bg-transparent text-white hover:bg-slate-600 px-3"
                  @click="handleMaxBet"
                >
                  Max
                </Button>
              </div>
            </div>
          </div>
          <slot name="manualButtons"></slot>
        </TabsContent>
        <TabsContent value="auto" class="space-y-6">
          <div class="space-y-3">
            <Label class="text-slate-300 text-sm">Bet Amount</Label>
            <div class="flex gap-2 shadow-2xl bg-slate-700 p-[2px] border rounded-md">
              <Input
                v-model.number="wagerAmount"
                class="!bg-slate-900 border-slate-600 text-white pr-12"
              />
              <div class="flex gap-1 items-center">
                <Button
                  class="bg-transparent text-white hover:bg-slate-600 px-3"
                  @click="handleHalfBet"
                >
                  ½
                </Button>
                <div class="block h-6 bg-border w-px" />

                <Button
                  class="bg-transparent text-white hover:bg-slate-600 px-3"
                  @click="handleDoubleBet"
                >
                  2×
                </Button>
                <div class="block h-6 bg-border w-px" />
                <Button
                  class="bg-transparent text-white hover:bg-slate-600 px-3"
                  @click="handleMaxBet"
                >
                  Max
                </Button>
              </div>
            </div>
          </div>
          <slot name="autoButtons"></slot>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
</template>
