import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useAuthTokenStore} from "@/stores/authToken.js";
import {ref} from "vue";

const previousRoute = ref(null);

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
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/la-bonne-franquette-website/dashboard',
            name: 'dashboard',
            component: () => import('../views/DashboardView.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            redirect: {name: 'home'}
        },
    ]
})

router.beforeEach((to, from, next) => {
    const authTokenStore = useAuthTokenStore();
    previousRoute.value = from;
    if (to.path === '/la-bonne-franquette-website/dashboard' && !authTokenStore.token) {
        next({ name: 'connexion' });
    } else {
        next();
    }
});

export { previousRoute };
export default router;
