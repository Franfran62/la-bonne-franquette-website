<script setup>
import {onBeforeMount, ref, watch} from "vue";
import MenuElements from "@/model/MenuElements.js";
import {fetchElements} from "@/services/menuEditService.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import VATRate, {getMultFromVAT} from "@/model/VATRate.js";

const emit = defineEmits(['result'])
const isLoading = ref(true);

const snackbarError = ref(false);
const errorText = ref("");
const valid = ref(false);
const products = ref([]);
const name = ref("");
const selectedProduct = ref(null);
const price = ref(0.00);
const totalPrice = ref(0.00);
const selectedVATRate = ref(VATRate.AUCUN);

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
})

watch(selectedVATRate, (newValue) => {
  totalPrice.value = Number((price.value * getMultFromVAT(newValue)).toFixed(2));
})

const handleCancel = () => {
  emit('result', null);
}

const handleSubmit = () => {
  emit('result', {
    name: name.value,
    price: price.value,
    totalPrice: totalPrice.value,
    VATRate: selectedVATRate.value,
    product: selectedProduct.value,
  });
}
</script>

<template>

    <v-form v-model="valid"
            validate-on="invalid-input"
            @submit.prevent="handleSubmit()">
      <v-text-field v-model="name"
                    label="Nom"
                    placeholder="Entrez le nom"
                    variant="outlined" :rules="[v => !!v || 'Le nom est nécessaire']"
                    required
                    rounded="xl"
                    density="compact"
                    color="primary"/>
      <v-select label="Produit"
                :items="products"
                v-model="selectedProduct"
                item-title="name"
                variant="outlined"
                density="compact"
                color="primary"
                :rules="[v => !!v || 'le produit est nécessaire']"
                rounded="xl"
                return-object/>
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

      </div>
      <div class="flex justify-center">
        <v-btn @click="handleSubmit" variant="text">
          Ajouter
        </v-btn>
      </div>
    </v-form>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>

</template>

<style scoped>

</style>