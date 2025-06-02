<script setup>
import {computed, onUpdated, ref, watch} from "vue";
import {useDisplay} from "vuetify";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import VATRate, {getMultFromVAT} from "@/model/VATRate.js";
import {getEnumKeyByValue} from "@/helpers/enumuHelpers.js";
import Addon from "@/model/Addon.js";

const props = defineProps({
  handleSubmit: {
    type: Function,
    required: true
  },
  addon: {
    type: Addon,
    required: false,
  }
});

const isLoading = ref(true);

const snackbarError = ref(false);
const errorText = ref("");

const {xs, sm} = useDisplay();
const valid = ref(false);
const isMobile = computed(() => xs.value || sm.value);
const name = ref("");
const price = ref(0.00);
const totalPrice = ref(0.00);
const selectedVATRate = ref(VATRate.AUCUN);

onUpdated(async () => {
  if (props.addon) {
    console.log(props.addon)
    name.value = props.addon.name
    selectedVATRate.value = VATRate[props.addon.vatRate];
    price.value = props.addon.price / 100;
    totalPrice.value = props.addon.totalPrice / 100;
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
              rounded="xl"
              class="input-spacing"/>
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