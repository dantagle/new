import { createRouter, createWebHistory } from 'vue-router'
import CatalogView from '../views/CatalogView.vue'

// vs React: routes are declared in code, not derived from the folder structure as in Next.js.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: CatalogView,
    },
    {
      path: '/experiences/:id',
      name: 'experience',
      // Lazy-loaded: a separate chunk, like next/dynamic or React.lazy.
      component: () => import('../views/ExperienceView.vue'),
      // vs React: `props: true` passes route params (:id) to the view as props, so the view
      // doesn't need to read the router (like receiving `params` in a Next.js page).
      props: true,
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },
  ],
})

export default router
