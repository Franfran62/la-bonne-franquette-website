<script setup>
import NavbarComponent from './components/NavbarComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex flex-col h-screen justify-between">
    <main>
      <RouterView />
    </main>

    <FooterComponent />
  </div>
</template>
