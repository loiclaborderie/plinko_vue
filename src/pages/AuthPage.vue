<template>
  <LoginForm v-if="isLogin" @clickOnRegister="isLogin = !isLogin" />
  <RegisterForm v-else @clickOnLogin="isLogin = !isLogin" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';

const isLogin = ref(true);
</script>
