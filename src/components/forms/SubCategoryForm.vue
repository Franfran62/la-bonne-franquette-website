<script setup>
import {computed, onUpdated, ref, watch} from "vue";
import {useDisplay} from "vuetify";
import MenuElements from "@/model/MenuElements.js";
import {fetchElements} from "@/services/menuEditService.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import SubCategory from "@/model/SubCategory.js";

const props = defineProps({
  handleSubmit: {
    type: Function,
    required: true
  },
  subCategory: {
    type: SubCategory,
    required: false,
  }
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

onUpdated(async () => {
  try {
    categories.value = await fetchElements(MenuElements.CATEGORY);
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }
});

watch(() => props.subCategory, (newSubCategory) => {
  if (newSubCategory) {
    name.value = newSubCategory.name;
    selectedCategory.value = categories.value.find((x) => x["id"] === newSubCategory.categoryId);
  }
}, {immediate: true});

watch(selectedCategory, (newValue) => {
  parentCategoryId.value = newValue.id;
});

const submitForm = async () => {
  try {
    await props.handleSubmit({
          name: name.value,
          category: selectedCategory.value,
          categoryType: 'sub-category'
        }
    );
  } catch (e) {
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
                  label="Nom de la sous-catégorie"
                  placeholder="Entrez le nom de la sous-catégorie"
                  variant="outlined" :rules="[v => !!v || 'Le nom est nécessaire']"
                  required
                  rounded="xl"
                  density="compact"
                  class="input-spacing"
                  color="primary"/>
    <v-select label="Catégorie parent"
              :items="categories"
              v-model="selectedCategory"
              item-title="name"
              item-value="value"
              variant="outlined"
              density="compact"
              color="primary"
              :rules="[v => !!v || 'La catégorie parent est nécessaire']"
              class="input-spacing"
              return-object
              rounded="xl"/>
    <div class="flex justify-center">
      <v-btn type="submit" color="primary" rounded="xl" :size="isMobile ? 'default' : 'large'">
        <div class="justify-start font-semibold">Valider</div>
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