<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useBalanceStore } from '@/stores/balanceStore';

const userStore = useUserStore();
const balanceStore = useBalanceStore();

const handleLogout = () => {
  userStore.logout();
};

const handleRefill = async () => {
  await balanceStore.refillBalance();
};
</script>

<template>
  <nav>
    <div v-if="!userStore.isConnected">
      <router-link to="/auth">Login/Register</router-link>
    </div>
    <div v-else>
      <span>Welcome, {{ userStore.user?.name }}</span>
      <span>Balance: {{ balanceStore.balance }}</span>
      <button @click="handleRefill">Refill</button>
      <button @click="handleLogout">Logout</button>
    </div>
  </nav>
  <main>
    <slot></slot> <!-- This is where the page content will be injected -->
  </main>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  background-color: var(--dark);
}

nav div {
  display: flex;
  gap: 1rem;
  align-items: center;
}

nav a,
nav button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-decoration: none;
  color: #333;
  background-color: #fff;
  cursor: pointer;
}

nav a:hover,
nav button:hover {
  background-color: #e0e0e0;
}
</style>
