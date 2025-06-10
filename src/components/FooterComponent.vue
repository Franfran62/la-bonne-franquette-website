<template>
    <footer class="bg-gray-100  h-150 text-center lg:text-left">
        <div class="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
        <nav class="flex flex-wrap justify-center -mx-5 -my-2">
            <div class="px-5 py-2">
                <RouterLink :to="{ name: 'faq' }" class="text-base leading-6 text-gray-600 lato-light routerlink-hover">
                    F.A.Q
                </RouterLink>
            </div>
            <div class="px-5 py-2">
                <RouterLink :to="{ name: 'mentions' }" class="text-base leading-6 text-gray-600 lato-light routerlink-hover">
                    Mentions légales
                </RouterLink>
            </div>
            <div class="px-5 py-2">
                <RouterLink @click="scrollTop()" to="" class="text-base leading-6 text-gray-600 lato-light  routerlink-hover">
                   Haut <ChevronUpIcon class="inline size-6" />
                </RouterLink>
            </div>
        </nav>
        <p class="mt-8 text-base leading-6 text-center text-gray-400">
            © 2024 La Bonne Franquette, All rights reserved.
        </p>
    </div>
    </footer>
</template>

<style scoped>
    .routerlink-hover {
        transition: 0.5s;
    }

    .routerlink-hover:hover {
        color: var(--color-text);
        font-weight: 500;
    }
</style>

<script setup>
    import { ChevronUpIcon } from '@heroicons/vue/24/outline';
    import { RouterLink } from 'vue-router';

    function scrollTop() {
        window.scroll({
            top:0,
            left:0,
    });
    }
</script>
