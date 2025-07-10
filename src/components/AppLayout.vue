<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import GuestHUD from './GuestHUD.vue';
import PlayerHUD from './PlayerHUD.vue';

const userStore = useUserStore();
</script>

<template>
  <GuestHUD v-if="!userStore.isConnected" />
  <PlayerHUD v-else />
  <main>
    <slot></slot> <!-- This is where the page content will be injected -->
  </main>
</template>
