<script setup>
import {computed, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useDisplay} from "vuetify";

const router = useRouter();

const {xs, sm, md} = useDisplay();
const isMobile = computed(() => xs.value || sm.value || md.value);

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

const textDecoration = (component) => {
    if(currentComponent.value === component) return "underline"
    return ""
}

watch(isMobile, (newValue) => {
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
  <v-app-bar app color="primary">
    <template v-if="!isMobile">
      <v-btn class="ml-8" color="secondary" text @click="setComponent('CommandComponent')">
        <span :class="textDecoration('CommandComponent')">Afficher les commandes </span>
      </v-btn>
      <v-btn color="secondary" text @click="setComponent('MenuComponent')">
        <span :class="textDecoration('MenuComponent')">Modifier la carte</span>
      </v-btn>
      <v-btn color="secondary" text @click="setComponent('TeamComponent')">
        <span :class="textDecoration('TeamComponent')">Modifier l'équipe</span>
      </v-btn>
    </template>
    <template v-else>
      <v-btn icon="mdi-menu" @click="toggleDrawer" color="white"></v-btn>
      <v-spacer></v-spacer>
    </template>
    <v-spacer></v-spacer>
    <v-icon icon="mdi-logout" @click="handleLogout" color="white" class="mr-4"/>
  </v-app-bar>
  <div v-if="isMobile">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item link base-color="secondary" @click="setComponent('CommandComponent')">
        <span :class="textDecoration('CommandComponent')">Afficher les commandes </span>
      </v-list-item>
      <v-list-item link base-color="secondary" @click="setComponent('MenuComponent')">
        <span :class="textDecoration('MenuComponent')">Modifier la carte</span>
      </v-list-item>
      <v-list-item link base-color="secondary" @click="setComponent('TeamComponent')">
        <span :class="textDecoration('TeamComponent')">Modifier l'équipe</span>
      </v-list-item>
    </v-navigation-drawer>
  </div>

</template>

<style scoped>

</style>