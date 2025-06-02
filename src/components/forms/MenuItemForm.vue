<script setup>
import {onBeforeMount, ref, watch} from "vue";
import MenuElements from "@/model/MenuElements.js";
import {fetchElements} from "@/services/menuEditService.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import VATRate, {getMultFromVAT} from "@/model/VATRate.js";
import {getEnumKeyByValue} from "@/helpers/enumuHelpers.js";

const emit = defineEmits(['result'])
const isLoading = ref(true);

const snackbarError = ref(false);
const errorText = ref("");
const valid = ref(false);
const products = ref([]);
const selectedProducts = ref(null);
const price = ref(0.00);
const totalPrice = ref(0.00);
const selectedVATRate = ref(VATRate.AUCUN);
const optional = ref(false);

onBeforeMount(async () => {
  try {
    products.value = await fetchElements(MenuElements.PRODUCT);
    isLoading.value = false;
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }
});

watch(price, (newValue) => {
  totalPrice.value = Number((newValue * getMultFromVAT(selectedVATRate.value)).toFixed(2));
  if (newValue === 0) {
    selectedVATRate.value = VATRate.AUCUN;
  }
})

watch(selectedVATRate, (newValue) => {
  totalPrice.value = Number((price.value * getMultFromVAT(newValue)).toFixed(2));
})

const formatPrice = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0,00";
  return Number(value).toFixed(2).replace('.', ',');
};

const submitForm = () => {
  emit('result', {
    prixHT: Number((price.value * 100).toFixed(2)),
    totalPrice: totalPrice.value,
    tauxTVA: getEnumKeyByValue(VATRate, selectedVATRate.value),
    products: selectedProducts.value,
    optional: optional.value,
  });
  selectedProducts.value = [];
  optional.value = false;
  selectedVATRate.value = VATRate.AUCUN;
  price.value = 0.00;
}
</script>

<template>

  <v-form v-model="valid"
          validate-on="invalid-input"
          @submit.prevent="submitForm()">
    <v-select label="Produit"
              :items="products"
              v-model="selectedProducts"
              item-title="name"
              variant="outlined"
              density="compact"
              color="primary"
              multiple
              chips
              clearable
              :rules="[v => !!v && v.length > 0 || 'Sélectionner au moins un produit']"
              rounded="xl"
              class="input-spacing"
              return-object/>
    <v-checkbox v-model="optional">
      <template v-slot:label>
        <div>
          Le produit est optionel ?
        </div>
      </template>
    </v-checkbox>
    <div class="flex justify-space-between input-spacing">
      <v-text-field v-model="price"
                    type="number"
                    label="Prix HT"
                    placeholder="Entrez le prix HT"
                    :min="0.00"
                    :step="0.01"
                    :rules="[v => v > 0 || 'Le prix est nécessaire']"
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

    </div>
    <div class="flex justify-center">
      <v-btn @click="submitForm" variant="text">
        Ajouter
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