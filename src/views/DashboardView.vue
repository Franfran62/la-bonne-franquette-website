<script setup>
import ToolbarComponent from "@/components/dashboard/ToolbarComponent.vue";
import {ref} from "vue";
import OrderComponent from "@/components/dashboard/OrderComponent.vue";
import MenuComponent from "@/components/dashboard/MenuComponent.vue";
import TeamComponent from "@/components/dashboard/TeamComponent.vue";
import RestaurantComponent from "@/components/dashboard/RestaurantComponent.vue";

const currentComponent = ref('CommandComponent');

const components = {
  CommandComponent: OrderComponent,
  MenuComponent,
  TeamComponent,
  RestaurantComponent,
}

const setComponent = (component) => {
  currentComponent.value = component;
}
</script>

<template>
  <v-app>
    <ToolbarComponent :currentComponent="currentComponent" @setComponent="setComponent"/>
    <div class="grid place-content-center mt-16">
      <component :is="components[currentComponent]"></component>
    </div>
  </v-app>
</template>

<style scoped>

</style>