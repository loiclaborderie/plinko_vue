<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router';
</script>

<template>
  <router-link to="/auth">Login/Register</router-link>
  <router-view />
</template>
