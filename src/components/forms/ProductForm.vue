<script setup>
import {computed, onUpdated, ref, watch} from "vue";
import {useDisplay} from "vuetify";
import MenuElements from "@/model/MenuElements.js";
import {fetchElements} from "@/services/menuEditService.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import VATRate, {getMultFromVAT} from "@/model/VATRate.js";
import {getEnumKeyByValue} from "@/helpers/enumuHelpers.js";
import Product from "@/model/Product.js";

const props = defineProps({
  handleSubmit: {
    type: Function,
    required: true
  },
  product: {
    type: Product,
    required: false,
  }
});

const isLoading = ref(true);
const snackbarError = ref(false);
const errorText = ref("");
const {xs, sm} = useDisplay();
const valid = ref(false);
const isMobile = computed(() => xs.value || sm.value);
const ingredients = ref([]);
const addons = ref([]);
const categories = ref([]);
const name = ref("");
const selectedIngredients = ref([]);
const selectedAddons = ref([]);
const selectedCategories = ref([]);
const price = ref(0.00);
const totalPrice = ref(0.00);
const selectedVATRate = ref(VATRate.AUCUN);

onUpdated(async () => {
  try {
    const fetchedIngredients = await fetchElements(MenuElements.INGREDIENT);
    const fetchedAddons = await fetchElements(MenuElements.ADDON);
    const fetchCategories = await fetchElements(MenuElements.SUBCATEGORY);

    if (fetchedAddons.length !== 0) {
      addons.value = [{name: "Tout sélectionner", isSelectAll: true}, ...fetchedAddons];
    }
    if (fetchedIngredients.length !== 0) {
      ingredients.value = [{name: "Tout sélectionner", isSelectAll: true}, ...fetchedIngredients];
    }
    if (fetchCategories.length !== 0) {
      categories.value = [{name: "Tout sélectionner", isSelectAll: true}, ...fetchCategories];
    }
    isLoading.value = false;
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }
  if (props.product) {
    console.log(props.product);
    name.value = props.product.name;
    selectedVATRate.value = VATRate[props.product.vatRate];
    price.value = props.product.price / 100;
    totalPrice.value = props.product.totalPrice / 100
    selectedCategories.value = props.product.categories;
    selectedIngredients.value = props.product.ingredients;
    selectedAddons.value = props.product.addons;
  }
});


watch(selectedIngredients, (newValue) => {
  const selectAll = newValue.find(item => item.isSelectAll);
  if (selectAll) {
    selectedIngredients.value = ingredients.value.filter(item => !item.isSelectAll);
  }
});

watch(selectedAddons, (newValue) => {
  const selectAll = newValue.find(item => item.isSelectAll);
  if (selectAll) {
    selectedAddons.value = addons.value.filter(item => !item.isSelectAll);
  }
});

watch(selectedCategories, (newValue) => {
  const selectAll = newValue.find(item => item.isSelectAll);
  if (selectAll) {
    selectedCategories.value = categories.value.filter(item => !item.isSelectAll);
  }
});

watch(price, (newValue) => {
  totalPrice.value = Number((newValue * getMultFromVAT(selectedVATRate.value)).toFixed(2));
  if (newValue === 0) {
    selectedVATRate.value = VATRate.AUCUN;
  }
});

watch(selectedVATRate, (newValue) => {
  totalPrice.value = Number((price.value * getMultFromVAT(newValue)).toFixed(2));
});

const formatPrice = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0,00";
  return Number(value).toFixed(2).replace('.', ',');
};

const submitForm = async () => {
  try {
    await props.handleSubmit({
      name: name.value,
      prixHT: Number((price.value * 100).toFixed(2)),
      tauxTVA: price.value === 0 ? VATRate.AUCUN : getEnumKeyByValue(VATRate, selectedVATRate.value),
      addons: selectedAddons.value,
      ingredients: selectedIngredients.value,
      categories: selectedCategories.value,
    });
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
                  label="Nom du produit"
                  placeholder="Entrez le nom du produit"
                  variant="outlined" :rules="[v => !!v || 'Le nom est nécessaire']"
                  required
                  rounded="xl"
                  density="compact"
                  class="input-spacing"
                  color="primary"/>
    <v-select label="Ingrédients"
              :items="ingredients"
              v-model="selectedIngredients"
              item-title="name"
              multiple
              chips
              clearable
              variant="outlined"
              density="compact"
              color="primary"
              :rules="[v => !!v && v.length > 0 || 'Sélectionner au moins un ingrédient']"
              rounded="xl"
              class="input-spacing"
              return-object
    />
    <v-select label="Extras"
              :items="addons"
              v-model="selectedAddons"
              item-title="name"
              multiple
              chips
              clearable
              variant="outlined"
              density="compact"
              color="primary"
              rounded="xl"
              class="input-spacing"
              return-object
    />
    <v-select label="Catégories"
              :items="categories"
              v-model="selectedCategories"
              item-title="name"
              multiple
              chips
              clearable
              variant="outlined"
              density="compact"
              color="primary"
              :rules="[v => !!v && v.length > 0 || 'Sélectionner au moins une catégorie']"
              rounded="xl"
              class="input-spacing"
              return-object
    />
    <div class="flex justify-space-between input-spacing">
      <v-text-field v-model="price"
                    type="number"
                    label="Prix HT"
                    placeholder="Entrez le prix HT"
                    :min="0.00"
                    :step="0.01"
                    :rules="[v => v >= 0 || 'Le prix est nécessaire']"
                    :formatter="formatPrice"
                    variant="outlined"
                    required
                    rounded="xl"
                    density="compact"
                    color="primary"
                    max-width="175"/>
      <v-text-field v-model="totalPrice"
                    type="number"
                    label="Prix TTC"
                    :min="0.00"
                    :step="0.01"
                    :formatter="formatPrice"
                    variant="outlined"
                    readonly
                    rounded="xl"
                    density="compact"
                    color="primary"
                    max-width="175"/>
    </div>
    <v-select label="Taux TVA"
              :items="Object.values(VATRate)"
              v-model="selectedVATRate"
              item-title="name"
              item-value="value"
              variant="outlined"
              density="compact"
              color="primary"
              :rules="[v => !!v || 'Le taux de TVA est nécessaire']"
              class="input-spacing"
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