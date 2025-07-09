import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import Auth from '@/pages/AuthPage.vue';
import PlinkoPage from '@/pages/PlinkoPage.vue';

const routes = [
  { path: '/auth', component: Auth, meta: { guest: true } },
  { path: '/', component: PlinkoPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isConnected;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth');
  } else if (to.meta.guest && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
