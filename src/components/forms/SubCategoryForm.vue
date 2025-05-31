<script setup>
import {computed, onBeforeMount, ref, watch} from "vue";
import {useDisplay} from "vuetify";
import MenuElements from "@/model/MenuElements.js";
import {fetchElements} from "@/services/menuEditService.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";

defineProps({
  handleSubmit: {
    type: Function,
    required: true
  },
});

const isLoading = ref(true);

const snackbarError = ref(false);
const errorText = ref("");

const {xs, sm} = useDisplay();
const valid = ref(false);
const isMobile = computed(() => xs.value || sm.value);
const categories = ref([]);
const name = ref("");
const selectedCategory = ref(null);
const parentCategoryId = ref(-1);

onBeforeMount(async () => {
  try {
    categories.value = await fetchElements(MenuElements.CATEGORY);
    isLoading.value = false;
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }
});

watch(selectedCategory, (newValue) => {
  parentCategoryId.value = newValue.id;
});

</script>

<template>
  <v-form v-model="valid"
          validate-on="invalid-input"
          @submit.prevent="handleSubmit({name: name, category: selectedCategory, categoryType: 'sub-category'})">
    <v-text-field v-model="name"
                  label="Nom de la sous-catégorie"
                  placeholder="Entrez le nom de la sous-catégorie"
                  variant="outlined" :rules="[v => !!v || 'Le nom est nécessaire']"
                  required
                  rounded="xl"
                  density="compact"
                  color="primary"/>
    <v-select label="Catégorie parent"
              :items="categories"
              v-model="selectedCategory"
              item-title="name"
              item-value="value"
              variant="outlined"
              density="compact"
              color="primary"
              :rules="[v => !!v || 'la catégorie parent est nécessaire']"
              return-object
              rounded="xl"/>
    <div class="flex justify-center">
      <v-btn type="submit" color="primary" rounded="xl" :size="isMobile ? 'default' : 'large'">
        <div class="justify-start font-semibold">Ajouter</div>
      </v-btn>
    </div>
  </v-form>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>

</template>

<style scoped>

</style>