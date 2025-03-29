<script setup>
import {computed, ref, watch} from "vue";
import logo from "@/assets/img/logo-no-bg.png";
import {useRouter} from "vue-router";
import {useDisplay} from "vuetify";

const router = useRouter();

const {xs} = useDisplay();

const isMobile = computed(() => xs.value);
const drawer = ref(false);

const emits = defineEmits(['setComponent']);
const currentComponent = ref("CommandComponent");

const setComponent = (component) => {
  currentComponent.value = component;
  emits('setComponent', component);
}

const buttonColor = (component) => {
  if (isMobile.value) {
    if (currentComponent.value === component) return "secondary"
    return "accent"
  } else {
    if (currentComponent.value === component) return "secondary"
    return "white"
  }
}

watch(isMobile, (newValue) => {
  console.log(newValue);
  if (!newValue) {
    drawer.value = false;
  }
});

const handleLogout = () => {
  router.push('connexion');
}

const toggleDrawer = () => {
  drawer.value = !drawer.value;
}
</script>

<template>
  <v-app-bar app color="accent">
    <template v-if="!isMobile">
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
    </template>
    <template v-else>
      <v-btn icon="mdi-menu" @click="toggleDrawer" color="white"></v-btn>
      <v-spacer></v-spacer>
      <v-img :src="logo" contain max-width="50"/>
    </template>
    <v-spacer></v-spacer>
    <v-icon icon="mdi-logout" @click="handleLogout" color="white" class="mr-4"/>
  </v-app-bar>
  <div v-if="isMobile">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item link :base-color="buttonColor('CommandComponent')" @click="setComponent('CommandComponent')">
        <span class="underline">Afficher les commandes </span>
      </v-list-item>
      <v-list-item link :base-color="buttonColor('MenuComponent')" @click="setComponent('MenuComponent')">
        <span class="underline">Modifier la carte</span>
      </v-list-item>
      <v-list-item link :base-color="buttonColor('TeamComponent')" @click="setComponent('TeamComponent')">
        <span class="underline">Modifier l'équipe</span>
      </v-list-item>
    </v-navigation-drawer>
  </div>

</template>

<style scoped>

</style>