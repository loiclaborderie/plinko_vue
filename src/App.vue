<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import { useUserStore } from './stores/userStore';
const userStore = useUserStore()
onMounted(async()=> {
  await userStore.checkAuthStatus();
})
</script>

<template>
  <router-link to="/auth">Login/Register</router-link>
  <router-view />
</template>
