<template>
  <div class="relative">
    <Input
      type="number"
      v-model="numberOfBets"
      class="!bg-slate-900 border-slate-600 text-white pr-12"
      step="1"
      min="0"
    />
    <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
      <InfinityIcon
        v-if="numberOfBets === 0"
        class="h-4 w-4 text-slate-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { InfinityIcon } from 'lucide-vue-next';
import Input from './ui/input/Input.vue';

  const numberOfBets = defineModel<number>()
</script>
