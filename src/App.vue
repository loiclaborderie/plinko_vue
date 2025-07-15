<script setup lang="ts">
import { computed, onMounted } from 'vue';import { RouterView, useRoute } from 'vue-router';
import { useUserStore } from './stores/userStore';
import AppLayout from './components/AppLayout.vue';
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

const userStore = useUserStore()

onMounted(async()=> {
  await userStore.checkAuthStatus();
})

const route = useRoute()

const layoutComponent = computed(() => {
  return route.meta.layout === 'none' ? 'div' : AppLayout
})
</script>

<template>
  <Toaster richColors position="top-right" :toastOptions="{ descriptionClass: '!text-muted-foreground'}" />
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>
