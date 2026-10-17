import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// vs React: routes are declared in code, not derived from the folder structure as in Next.js.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router
