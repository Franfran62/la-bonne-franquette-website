<script setup>
import {ref} from "vue";
import logo from "@/assets/img/logo-no-bg.png";

const emits = defineEmits(['setComponent']);
const currentComponent = ref("CommandComponent");

const setComponent = (component) => {
  currentComponent.value = component;
  emits('setComponent', component);
}

const buttonColor = (component) => {
  if (currentComponent.value === component) return "secondary"
  return "white"
}
</script>

<template>
  <v-app-bar app color="accent">
    <v-img :src="logo" contain max-width="50" class="ml-8"/>
    <v-btn :color="buttonColor('CommandComponent')" text @click="setComponent('CommandComponent')">
      <span class="underline">Afficher les commandes </span>
    </v-btn>
    <v-btn :color="buttonColor('MenuComponent')" text @click="setComponent('MenuComponent')">
      <span class="underline">Modifier la carte</span>
    </v-btn>
    <v-btn :color="buttonColor('TeamComponent')" text @click="setComponent('TeamComponent')">
      <span class="underline">Modifier l'équipe</span>
    </v-btn>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<style scoped>

</style>