<script setup lang="ts">
import PlinkoCanva from './components/PlinkoCanva.vue'
import { useBalanceStore } from './stores/balanceStore'
import { useUserStore } from './stores/userStore'
const balanceStore = useBalanceStore()
const userStore = useUserStore()

async function register() {
  const data = {
    name: 'Loic',
    email: 'l.laborderie-boulou@tbs-education.org',
    password: 'test',
    password_confirmation: 'test',
  }
  const url = 'http://localhost:8000/api/register'
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

function login() {
  const data = {
    email: 'l.laborderie-boulou@tbs-education.org',
    password: 'test',
  }
  const url = 'http://localhost:8000/api/login'
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data)
      userStore.connect(data.user, data.token)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
</script>

<template>
  {{ userStore.user }}
  <button @click="register">Register</button>
  <button @click="login">Login</button>
  <header>
    <h1>Plinko</h1>
  </header>

  <main>
    <PlinkoCanva />
    Balance:
    <span style="font-size: xx-large; font-weight: 900">{{ balanceStore.balance ?? 0 }}</span>
  </main>
</template>

<style>
h1 {
  text-align: center;
  font-weight: 900;
  font-size: 40px;
}
</style>
