<script setup>

import {ref} from "vue";
import InfiniteLoader from "@/components/loaders/InfiniteLoader.vue";

const isLoading = ref(true)
</script>

<template>
  <div v-if="isLoading">
    <InfiniteLoader class="flex justify-center align-center h-screen"/>
  </div>
  <div v-else>

  </div>
</template>

<style scoped>

</style>