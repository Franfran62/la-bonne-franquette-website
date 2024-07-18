import { createRouter, createWebHistory } from 'vue-router'
import NotFoundView from '../views/NotFoundView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/la-bonne-franquette-website',
      name: 'home',
      component: HomeView
    },
    {
      path: '/mentions-legales',
      name: 'mentions',
      component: () => import('../views/MentionsView.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue')
    }, 
    { 
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      component: NotFoundView 
    },
  ]
})

export default router
