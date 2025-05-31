<script setup>
import {computed, ref} from "vue";
import {useDisplay} from "vuetify";

defineProps({
  handleSubmit: {
    type: Function,
    required: true
  },
});

const {xs, sm} = useDisplay();
const valid = ref(false);
const isMobile = computed(() => xs.value || sm.value);
const name = ref("");
</script>

<template>
  <v-form v-model="valid"
          validate-on="invalid-input"
          @submit.prevent="handleSubmit({name: name, categoryType: 'category'})">
    <v-text-field v-model="name"
                  label="Nom de catégorie"
                  placeholder="Entrez le nom de la catégorie"
                  variant="outlined"
                  :rules="[v => !!v || 'Le nom est nécessaire']"
                  required
                  rounded="xl"
                  density="compact"
                  color="primary"/>
    <div class="flex justify-center">
      <v-btn type="submit" color="primary" rounded="xl" :size="isMobile ? 'default' : 'large'">
        <div class="justify-start font-semibold">Ajouter</div>
      </v-btn>
    </div>
  </v-form>
</template>

<style scoped>

</style>