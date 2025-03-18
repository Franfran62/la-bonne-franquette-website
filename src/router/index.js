import { createRouter, createWebHistory } from 'vue-router'
import NotFoundView from '../views/NotFoundView.vue'
import HomeView from '../views/HomeView.vue'

const apiUrl = import.meta.env.VITE_API_URL;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/la-bonne-franquette-website',
      name: 'home',
      component: HomeView
    },
    {
      path: '/la-bonne-franquette-website/mentions-legales',
      name: 'mentions',
      component: () => import('../views/MentionsView.vue')
    },
    {
      path: '/la-bonne-franquette-website/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue')
    }, 
    {
      path: '/la-bonne-franquette-website/connexion',
      name: 'connexion',
      component: () => import('../views/ConnexionView.vue')
    },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      redirect: { name: 'home' }
    },
  ]
})

export default router
