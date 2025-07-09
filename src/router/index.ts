import { createRouter, createWebHistory } from 'vue-router';
import Auth from '@/pages/AuthPage.vue';
import PlinkoPage from '@/pages/PlinkoPage.vue';

const routes = [
  { path: '/auth', component: Auth },
  { path: '/', component: PlinkoPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
