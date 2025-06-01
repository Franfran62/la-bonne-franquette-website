<script setup>
import {computed, onBeforeMount, ref, watch} from "vue";
import {useDisplay} from "vuetify";
import MenuElements from "@/model/MenuElements.js";
import {fetchElements} from "@/services/menuEditService.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import VATRate, {getMultFromVAT} from "@/model/VATRate.js";
import {getEnumKeyByValue} from "@/helpers/enumuHelpers.js";

const props = defineProps({
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
const name = ref("");
const selectedIngredient = ref(null);
const price = ref(0.00);
const totalPrice = ref(0.00);
const selectedVATRate = ref(VATRate.AUCUN);

onBeforeMount(async () => {
  try {
    ingredients.value = await fetchElements(MenuElements.INGREDIENT);
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
});

watch(selectedVATRate, (newValue) => {
  totalPrice.value = Number((price.value * getMultFromVAT(newValue)).toFixed(2));
});

const submitForm = async () => {
  try {
    await props.handleSubmit({
      name: name.value,
      prixHT: Number((price.value * 100).toFixed(2)),
      tauxTVA: price.value === 0 ? VATRate.AUCUN : getEnumKeyByValue(VATRate, selectedVATRate.value),
      ingredient: selectedIngredient.value,
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
                  label="Nom de l'extra"
                  placeholder="Entrez le nom de l'extra"
                  variant="outlined" :rules="[v => !!v || 'Le nom est nécessaire']"
                  required
                  rounded="xl"
                  density="compact"
                  class="input-spacing"
                  color="primary"/>
    <v-select label="Ingrédient correspondant"
              :items="ingredients"
              v-model="selectedIngredient"
              item-title="name"
              variant="outlined"
              density="compact"
              color="primary"
              :rules="[v => !!v || 'L\'ingrédient est nécessaire']"
              return-object
              class="input-spacing"
              rounded="xl"/>
    <div class="flex justify-space-between input-spacing">
      <v-text-field v-model="price"
                    type="number"
                    label="Prix HT"
                    placeholder="Entrez le prix HT"
                    :min="0.00"
                    :step="0.01"
                    :rules="[v => v >= 0 || 'Le prix est nécessaire']"
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
              :rules="[v => !!v || 'Le taux de TVA est nécessaire']"
              rounded="xl"
              class="input-spacing"/>
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