<script setup>
import {ref} from "vue";

const emits = defineEmits(['setComponent']);
const currentComponent = ref("");

const setComponent = (component) => {
  currentComponent.value = component;
  emits('setComponent', component);
}
</script>

  <template>
    <v-app-bar app>
      <v-toolbar-title>Ma Navbar</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="setComponent('CommandComponent')">Afficher les commandes</v-btn>
      <v-btn text @click="setComponent('MenuComponent')">Modifier la carte</v-btn>
      <v-btn text @click="setComponent('TeamComponent')">Modifier l'équipe</v-btn>
    </v-app-bar>
</template>

<style scoped>

</style>