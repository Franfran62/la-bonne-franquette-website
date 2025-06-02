<script setup>
import {computed, onUpdated, ref} from "vue";
import {useDisplay} from "vuetify";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import Ingredients from "@/model/Ingredients.js";

const props = defineProps({
  handleSubmit: {
    type: Function,
    required: true
  },
  ingredient: {
    type: Ingredients,
    required: false,
  }
});

const {xs, sm} = useDisplay();
const snackbarError = ref(false);
const errorText = ref("");

const valid = ref(false);
const isMobile = computed(() => xs.value || sm.value);
const name = ref("");

onUpdated(() => {
  if (props.ingredient) {
    name.value = props.ingredient.name;
  }
});

const submitForm = async () => {
  try {
    await props.handleSubmit({name: name.value,});
  } catch
      (e) {
    errorText.value = e;
    snackbarError.value = true;
  }
}
</script>

<template>
  <v-form v-model="valid"
          validate-on="invalid-input"
          @submit.prevent="submitForm">
    <v-text-field v-model="name"
                  label="Nom de l'ingrédient"
                  placeholder="Entrez le nom de l'ingrédient'"
                  variant="outlined"
                  :rules="[v => !!v || 'Le nom est nécessaire']"
                  required
                  rounded="xl"
                  density="compact"
                  class="input-spacing"
                  color="primary"/>
    <div class="flex justify-center">
      <v-btn type="submit" color="primary" rounded="xl" :size="isMobile ? 'default' : 'large'">
        <div class="justify-start font-semibold">Ajouter</div>
      </v-btn>
    </div>
  </v-form>
  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>
</template>

<style scoped>
.input-spacing {
  margin-bottom: 8px;
}
</style>