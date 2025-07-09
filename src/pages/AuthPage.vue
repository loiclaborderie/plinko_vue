<template>
  <div>
    <h1 v-if="isLogin">Login</h1>
    <h1 v-else>Register</h1>

    <LoginForm v-if="isLogin" />
    <RegisterForm v-else />

    <p>
      <a href="#" @click.prevent="isLogin = !isLogin">
        {{ isLogin ? 'Need an account? Register' : 'Already have an account? Login' }}
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';

const isLogin = ref(true);
</script>
