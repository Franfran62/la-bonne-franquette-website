<script setup>
import {computed, onBeforeMount, ref, watch} from "vue";
import {useDisplay} from "vuetify";
import MenuElements from "@/model/MenuElements.js";
import {fetchElements} from "@/services/menuEditService.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import VATRate, {getMultFromVAT} from "@/model/VATRate.js";

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
const ingredients = ref([]);
const addons = ref([]);
const name = ref("");
const selectedIngredients = ref([]);
const selectedAddons = ref([]);
const price = ref(0.00);
const totalPrice = ref(0.00);
const selectedVATRate = ref(VATRate.AUCUN);

onBeforeMount(async () => {
  try {
    const fetchedIngredients = await fetchElements(MenuElements.INGREDIENT);
    const fetchedAddons = await fetchElements(MenuElements.ADDON);

    ingredients.value = [{name: "Tout sélectionner", isSelectAll: true}, ...fetchedIngredients];
    addons.value = [{name: "Tout sélectionner", isSelectAll: true}, ...fetchedAddons];

    isLoading.value = false;
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
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

watch(price, (newValue) => {
  totalPrice.value = Number((newValue * getMultFromVAT(selectedVATRate.value)).toFixed(2));
});

watch(selectedVATRate, (newValue) => {
  totalPrice.value = Number((price.value * getMultFromVAT(newValue)).toFixed(2));
});
</script>

<template>
  <v-form v-model="valid"
          validate-on="invalid-input"
          @submit.prevent="handleSubmit({
              name: name,
              price: price,
              totalPrice: totalPrice,
              VATRate: selectedVATRate,
              addons: selectedAddons,
              ingredients: selectedIngredients,
              })">
    <v-text-field v-model="name"
                  label="Nom du produit"
                  placeholder="Entrez le nom du produit"
                  variant="outlined" :rules="[v => !!v || 'Le nom est nécessaire']"
                  required
                  rounded="xl"
                  density="compact"
                  color="primary"/>
    <v-select label="Ingrédients"
              :items="ingredients"
              v-model="selectedIngredients"
              item-title="name"
              multiple
              chips
              variant="outlined"
              density="compact"
              color="primary"
              :rules="[v => !!v || 'les ingrédients sont nécessaires']"
              rounded="xl"
              return-object
    />
    <v-select label="Extras"
              :items="addons"
              v-model="selectedAddons"
              item-title="name"
              multiple
              chips
              variant="outlined"
              density="compact"
              color="primary"
              :rules="[v => !!v || 'les extras sont nécessaires']"
              rounded="xl"
              return-object
    />
    <div class="flex justify-space-between">
      <v-text-field v-model="price"
                    type="number"
                    label="Prix HT"
                    placeholder="Entrez le prix HT"
                    :min="0.00"
                    :step="0.01"
                    :rules="[v => !!v || 'Le prix est nécessaire']"
                    :formatter="v => Number(v).toFixed(2)"
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
                    :formatter="v => Number(v).toFixed(2)"
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
              :rules="[v => !!v || 'le taux de TVA est nécessaire']"
              rounded="xl"/>
    <div class="flex justify-center">
      <v-btn type="submit" color="primary" rounded="xl" :size="isMobile ? 'default' : 'large'">
        <div class="justify-start font-semibold">Ajouter</div>
      </v-btn>
    </div>
  </v-form>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>
</template>