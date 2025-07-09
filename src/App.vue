<script setup lang="ts">
import { onMounted } from 'vue';import { RouterView } from 'vue-router';
import { useUserStore } from './stores/userStore';
const userStore = useUserStore()
onMounted(async()=> {
  await userStore.checkAuthStatus();
})
</script>

<template>
  <Layout>
    <router-view />
  </Layout>
</template>
