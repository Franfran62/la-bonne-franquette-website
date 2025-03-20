<script setup>
import ToolbarComponent from "@/components/dashboard/ToolbarComponent.vue";
import {ref} from "vue";
import CommandComponent from "@/components/dashboard/CommandComponent.vue";
import MenuComponent from "@/components/dashboard/MenuComponent.vue";
import TeamComponent from "@/components/dashboard/TeamComponent.vue";

const currentComponent = ref('CommandComponent');

const components = {
  CommandComponent,
  MenuComponent,
  TeamComponent,
}

const setComponent = (component) => {
  currentComponent.value = component;
  console.log(currentComponent.value)
}
</script>

<template>
  <v-app>
    <ToolbarComponent :currentComponent="currentComponent" @setComponent="setComponent"/>
    <component :is="components[currentComponent]"></component>
  </v-app>
</template>

<style scoped>

</style>