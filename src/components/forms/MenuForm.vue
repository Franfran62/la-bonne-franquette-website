<script setup>
import {computed, ref, watch} from "vue";
import {useDisplay} from "vuetify";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import VATRate, {getMultFromVAT} from "@/model/VATRate.js";
import MenuItemForm from "@/components/forms/MenuItemForm.vue";
import {getEnumKeyByValue} from "@/helpers/enumuHelpers.js";

/*
TODO: Ajouter un bouton de duplication des menuItems
 */

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
const menuItems = ref([]);
const name = ref("");
const price = ref(0.00);
const totalPrice = ref(0.00);
const selectedVATRate = ref(VATRate.AUCUN);

const showDialog = ref(false);

watch(price, (newValue) => {
  totalPrice.value = Number((newValue * getMultFromVAT(selectedVATRate.value)).toFixed(2));
})

watch(selectedVATRate, (newValue) => {
  totalPrice.value = Number((price.value * getMultFromVAT(newValue)).toFixed(2));
})

const updateCreation = (result) => {
  if (!menuItems.value.some(item => JSON.stringify(item) === JSON.stringify(result))) {
    menuItems.value.push(result);
  }
  showDialog.value = false;
}

const removeFromList = (index) => {
  menuItems.value.splice(index, 1);
}

</script>

<template>

  <v-form v-model="valid"
          validate-on="invalid-input"
          @submit.prevent="handleSubmit({name: name, prixHT: Number((price*100).toFixed(2)), tauxTVA: getEnumKeyByValue(VATRate,selectedVATRate), menuItems: menuItems})">
    <v-text-field v-model="name"
                  label="Nom du menu"
                  placeholder="Entrez le nom du menu"
                  variant="outlined" :rules="[v => !!v || 'Le nom est nécessaire']"
                  required
                  rounded="xl"
                  density="compact"
                  color="primary"/>
    <div>
      Choix :
    </div>
    <v-list>
      <v-list-item v-for="(menuItem, i) in menuItems"
                   :key="i" variant="text">
        <v-list-item-title>
          {{ menuItem.name }}: <br> {{ menuItem.product.name }} - {{ menuItem.totalPrice }}€ - {{ menuItem.TauxTVA }} -
          {{ menuItem.required ? "Requis" : "Non Requis" }}
          <v-btn icon="mdi-window-close" variant="text" @click="removeFromList(i)"/>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-expansion-panels class="mb-6">
      <v-expansion-panel title="Ajouter un nouveau choix" expand-icon="mdi-plus" collapse-icon="mdi-plus">
        <v-expansion-panel-text>
          <MenuItemForm @result="updateCreation"/>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

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