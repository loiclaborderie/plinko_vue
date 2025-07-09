<template>
  <form @submit.prevent="submitRegister">
    <div>
      <label for="registerName">Name:</label>
      <input type="text" id="registerName" v-model="form.name">
    </div>
    <div>
      <label for="registerEmail">Email:</label>
      <input type="email" id="registerEmail" v-model="form.email">
    </div>
    <div>
      <label for="registerPassword">Password:</label>
      <input type="password" id="registerPassword" v-model="form.password">
    </div>
    <div>
      <label for="registerPasswordConfirmation">Confirm Password:</label>
      <input type="password" id="registerPasswordConfirmation" v-model="form.password_confirmation">
    </div>
    <button type="submit">Register</button>
    <div v-if="errors.general" class="error-message">{{ errors.general }}</div>
    <div v-if="errors.name" class="error-message">{{ errors.name[0] }}</div>
    <div v-if="errors.email" class="error-message">{{ errors.email[0] }}</div>
    <div v-if="errors.password" class="error-message">{{ errors.password[0] }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router';

const form = ref({
  name: 'testuser',
  email: 'l.laborderie-boulou@tbs-education.org',
  password: 'password',
  password_confirmation: 'password'
});

const errors = ref<{general?:string, name?:string, email?:string, password?:string}>({});

const submitRegister = async () => {
  errors.value = {};
  try {
    const response = await axios.post('/register', form.value);
    console.log('Registration successful:', response.data);
    router.push('/')

  } catch (error: any) {
    console.error('Registration failed:', error);
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors;
    } else {
      errors.value.general = 'An unexpected error occurred. Please try again.';
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}
</style>
