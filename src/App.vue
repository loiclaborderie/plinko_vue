<script setup lang="ts">
import { onMounted } from 'vue';import { RouterView } from 'vue-router';
import { useUserStore } from './stores/userStore';
import AppLayout from './components/AppLayout.vue';
const userStore = useUserStore()
onMounted(async()=> {
  await userStore.checkAuthStatus();
})
</script>

<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>
