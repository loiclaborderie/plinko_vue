<template>
  <form @submit.prevent="submitLogin">
    <div>
      <label for="loginEmail">Email:</label>
      <input type="email" id="loginEmail" v-model="form.email">
    </div>
    <div>
      <label for="loginPassword">Password:</label>
      <input type="password" id="loginPassword" v-model="form.password">
    </div>
    <button type="submit">Login</button>
    <div v-if="errors.general" class="error-message">{{ errors.general }}</div>
  </form>
</template>

<script setup lang="ts">
import axios from 'axios';
import router from '@/router';
import { ref } from 'vue';

const errors = ref<{general?: string}>({});


const form = ref({
  email: 'test@test.com',
  password: 'password'
});

const submitLogin = async () => {
  errors.value = {};
  try {
    const response = await axios.post('/login', form.value);
    console.log('Login successful:', response.data);

    router.push('/')

  } catch (error: any) {
    console.error('Login failed:', error);
    if (error.response && error.response.status === 422) {
      errors.value.general = 'Wrong email or password.';
    } else {
      errors.value.general = 'An unexpected error occurred. Please try again.';
    }
  }
};
</script>
