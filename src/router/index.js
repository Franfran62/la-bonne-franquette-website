import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useAuthTokenStore} from "@/stores/authToken.js";
import {ref} from "vue";

const previousRoute = ref(null);

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            meta: {
                visible: true,
                title: 'Accueil',
            },
            component: HomeView
        },
        {
            path: '/mentions-legales',
            name: 'mentions',
            meta: {
                visible: true,
                title: 'Mentions légales',
            },
            component: () => import('../views/MentionsView.vue')
        },
        {
            path: '/faq',
            name: 'faq',
            meta: {
                visible: true,
                title: 'Foire aux questions',
            },
            component: () => import('../views/FaqView.vue')
        },
        {
            path: '/connexion',
            name: 'connexion',
            meta: {
                visible: false,
                title: 'Connexion',
            },
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            meta: {
                visible: true,
                title: 'Panel d\'administration',
            },
            component: () => import('../views/DashboardView.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            meta: {
                visible: false,
                title: 'Page non trouvée',
            },
            redirect: {name: 'home'}
        },
    ]
})

router.beforeEach((to, from, next) => {
    const authTokenStore = useAuthTokenStore();
    previousRoute.value = from;
    if (to.path === '/dashboard' && !authTokenStore.token) {
        next({ name: 'connexion' });
    } else {
        next();
    }
});

export { previousRoute };
export default router;
