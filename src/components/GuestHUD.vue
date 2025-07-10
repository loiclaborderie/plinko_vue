<template>
  <nav class="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-2">
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-full flex items-center justify-center">
            <span class="text-lg font-bold text-muted-foreground">P</span>
          </div>
          <div>
            <h2 class="font-semibold text-foreground">Plinko Game</h2>
            <p class="text-sm text-muted-foreground">Guest Mode</p>
          </div>
        </div>

        <div class="hidden md:block w-px h-8 bg-border" />

        <div class="bg-secondary/30 px-4 py-1 rounded-lg border border-dashed">
          <p class="text-sm text-muted-foreground">Demo Mode</p>
          <p class="text-lg font-semibold text-muted-foreground">
            Connect to play
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <button
          class="cursor-pointer text-foreground border border-border hover:bg-secondary rounded px-3 py-1.5 text-sm inline-flex items-center"
          @click="goToAuth"
        >
          <LogIn class="w-4 h-4 mr-2" />
          Login
        </button>

        <button
          class="cursor-pointer bg-primary text-white hover:bg-primary/90 rounded px-3 py-1.5 text-sm inline-flex items-center"
          @click="goToAuth"
        >
          <UserPlus class="w-4 h-4 mr-2" />
          Sign Up
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { LogIn, UserPlus } from 'lucide-vue-next';

const router = useRouter();
const goToAuth = () => {
  router.push('/auth');
};
</script>
