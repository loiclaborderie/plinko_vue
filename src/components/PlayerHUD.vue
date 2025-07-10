<template>
  <nav class="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-2">
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <User class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="font-semibold text-foreground">{{ userStore.user.name }}</h2>
            <p class="text-sm text-muted-foreground">Player</p>
          </div>
        </div>

        <div class="hidden md:block w-px h-8 bg-border" />

        <div class="bg-secondary/50 px-4 py-1 rounded-lg border">
          <p class="text-sm text-muted-foreground">Balance</p>
          <div class="text-xl font-bold text-plinko-gold flex gap-x-2 items-center">
            <NumberFlow :value="balanceStore.balance ?? 0" :format="{ style: 'currency', currency: 'USD' }" />
            <div id="refill" @click="refillBalance" class="p-1 cursor-pointer">
              <CirclePlus class="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <button
          class="hover:bg-secondary rounded px-2 py-1"
          @click="onToggleSound"
        >
          <component :is="soundEnabled ? Volume2 : VolumeX" class="w-4 h-4" />
        </button>

        <button
          class="hover:bg-secondary rounded px-2 py-1"
          @click="onSettings"
        >
          <Settings class="w-4 h-4" />
        </button>

        <button
          class="cursor-pointer hover:bg-destructive/20 text-destructive rounded px-2 py-1"
          @click="userStore.logout"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useBalanceStore } from '@/stores/balanceStore';
import { useUserStore } from '@/stores/userStore';
import {
  User,
  Settings,
  Volume2,
  VolumeX,
  LogOut,
  CirclePlus
} from 'lucide-vue-next';
import NumberFlow from '@number-flow/vue'
import { toast } from 'vue-sonner';

type PlayerHUDProps = {
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onSettings?: () => void;
}

defineProps<PlayerHUDProps>();

const userStore = useUserStore()
const balanceStore = useBalanceStore()

const refillBalance = async() => {
  try {
    await balanceStore.refillBalance()
    toast.success('Refilled', {description: 'Your balance was successfully refilled.'})
  } catch (e: any){
    toast.error('Error', {description: 'Failed to refill your balance. Please try again later.'})
  }
}


</script>
