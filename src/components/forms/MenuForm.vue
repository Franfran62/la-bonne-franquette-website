<script setup>
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import VATRate, { getMultFromVAT } from "@/model/VATRate.js";
import MenuItemForm from "@/components/forms/MenuItemForm.vue";
import { getEnumKeyByValue } from "@/helpers/enumHelpers.js";
import Menu from "@/model/Menu.js";

const props = defineProps({
  handleSubmit: {
    type: Function,
    required: true
  },
  menu: {
    type: Menu,
    required: false,
  }
});

const snackbarError = ref(false);
const errorText = ref("");
const valid = ref(false);
const { xs, sm, md } = useDisplay();
const isMobile = computed(() => xs.value || sm.value || md.value);
const menuItems = ref([]);
const name = ref("");
const price = ref(0.00);
const totalPrice = ref(0.00);
const selectedVATRate = ref(VATRate.AUCUN);

const showDialog = ref(false);

watch(price, (newValue) => {
  totalPrice.value = Number((newValue * getMultFromVAT(selectedVATRate.value)).toFixed(2));
  if (newValue === 0) {
    selectedVATRate.value = VATRate.AUCUN;
  }
});

watch(selectedVATRate, (newValue) => {
  totalPrice.value = Number((price.value * getMultFromVAT(newValue)).toFixed(2));
});

watch(() => props.menu, (newMenu) => {
  if (newMenu) {
    name.value = newMenu.name;
    selectedVATRate.value = VATRate[newMenu.vatrate];
    price.value = newMenu.price / 100;
    totalPrice.value = newMenu.totalPrice / 100;
    menuItems.value = newMenu.menuItems;
  }
}, { immediate: true });

const updateCreation = (result) => {
  result.price = result.price;
  result.totalPrice = result.totalPrice;
  if (!menuItems.value.some(item => JSON.stringify(item) === JSON.stringify(result))) {
    menuItems.value.push(result);
  }
  showDialog.value = false;
}

const removeFromList = (index) => {
  menuItems.value.splice(index, 1);
}

const duplicateFromList = (index) => {
  const duplicatedMenuItem = JSON.parse(JSON.stringify(menuItems.value[index]));
  menuItems.value.push(duplicatedMenuItem);
};

const formatPrice = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0,00";
  return Number(value).toFixed(2).replace('.', ',');
};

const submitForm = async () => {
  if (menuItems.value.length < 1) {
    errorText.value = "Votre Menu doit au moins comporter un Produit"
    snackbarError.value = true;
    return;
  }
  try {
    await props.handleSubmit({
      name: name.value,
      price: Number((price.value * 100).toFixed(2)),
      vatrate: getEnumKeyByValue(VATRate, selectedVATRate.value),
      menuItems: menuItems.value,
    });
  } catch (e) {
    errorText.value = e;
    snackbarError.value = true;
  }
}

</script>

<template>

  <v-form v-model="valid" validate-on="invalid-input" @submit.prevent="submitForm">
    <v-text-field v-model="name" label="Nom du menu" placeholder="Entrez le nom du menu" variant="outlined"
      :rules="[v => !!v || 'Le nom est nécessaire']" required rounded="xl" density="compact" class="input-spacing"
      color="primary" />
    <div>
      Choix :
    </div>
    <v-list class="input-spacing">
      <v-list-item v-for="(menuItem, i) in menuItems" :key="i" variant="text">
        <v-list-item-title>
          {{ Number((menuItem.totalPrice / 100).toFixed(2)) }}€ - TVA : {{ VATRate[menuItem.VATRate] }} -
          {{ menuItem.optional ? "Optionel" : "Obligatoire" }}
          <v-btn icon="mdi-content-duplicate" variant="text" @click="duplicateFromList(i)" />
          <v-btn icon="mdi-window-close" variant="text" @click="removeFromList(i)" />
          <v-list>
            <v-list-item v-for="(item, j) in menuItem.products" :key="j" variant="text">
              <v-list-item>
                {{ item.name }}
              </v-list-item>
            </v-list-item>
          </v-list>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-expansion-panels class="input-spacing" variant="default">
      <v-expansion-panel title="Ajouter un nouveau choix" expand-icon="mdi-plus" collapse-icon="mdi-plus">
        <v-expansion-panel-text>
          <MenuItemForm @result="updateCreation" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="flex justify-space-between mt-6 input-spacing">
      <v-text-field v-model="price" type="number" label="Prix HT" placeholder="Entrez le prix HT" :min="0.00"
        :step="0.01" :rules="[v => v >= 0 || 'Le prix est nécessaire']" :formatter="formatPrice" variant="outlined"
        required rounded="xl" density="compact" color="primary" max-width="175" />
      <v-text-field v-model="totalPrice" type="number" label="Prix TTC" :min="0.00" :step="0.01"
        :formatter="formatPrice" variant="outlined" readonly rounded="xl" density="compact" color="primary"
        max-width="175" />
    </div>
    <v-select label="Taux TVA" :items="Object.values(VATRate)" v-model="selectedVATRate" item-title="name"
      item-value="value" variant="outlined" density="compact" color="primary"
      :rules="[v => !!v || 'Le taux de TVA est nécessaire']" return-object class="input-spacing" rounded="xl" />
    <div class="flex justify-center">
      <v-btn type="submit" color="primary" rounded="xl" :size="isMobile ? 'default' : 'large'">
        <div class="justify-start font-semibold">Valider</div>
      </v-btn>
    </div>
  </v-form>
  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v" />
</template>

<style scoped>
.input-spacing {
  margin-bottom: 8px;
}
</style>