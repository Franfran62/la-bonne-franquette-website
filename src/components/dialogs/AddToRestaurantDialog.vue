<script setup>

import {defineProps, ref, watch} from "vue";
import MenuElements from "@/model/MenuElements.js";
import CategoryForm from "@/components/forms/CategoryForm.vue";
import SubCategoryForm from "@/components/forms/SubCategoryForm.vue";
import AddonForm from "@/components/forms/AddonForm.vue";
import IngredientForm from "@/components/forms/IngredientForm.vue";
import ProductForm from "@/components/forms/ProductForm.vue";
import MenuForm from "@/components/forms/MenuForm.vue";
import {createNewElement} from "@/services/menuEditService.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import SuccessInfo from "@/components/snackbars/SuccessInfo.vue";
import HintInfo from "@/components/snackbars/HintInfo.vue";

/*
TODO: Ajouter la vérifications des formulaires avant leur envoie
TODO: Gérer l'affichage des erreurs et des autres messages
TODO: Gérer la gestion des doublons (voir le back)
 */

const props = defineProps({
  enable: {
    type: Boolean
  },
});
const emit = defineEmits(['result'])

const snackbarError = ref(false);
const snackbarSuccess = ref(false);
const snackbarInfo = ref(false);

const errorText = ref("");
const succesText = ref("");
const infoText = ref("");

const localEnable = ref(props.enable);
const selectedElementType = ref(MenuElements.CATEGORY);

watch(() => props.enable, (newVal) => {
  localEnable.value = newVal;
});

watch(selectedElementType, (newVal) => {
  console.log(newVal);
});

const handleCancel = () => {
  emit('result', false);
  localEnable.value = false;
}

const handleSubmit = async(data) => {
  console.log(JSON.stringify(data));

  const response  = await createNewElement(selectedElementType.value, data);
  console.log(response);
  if(response.status === 200) {
    succesText.value = response.data["Response"];
    snackbarSuccess.value = true;
  } else {
    errorText.value = response.data.message;
    snackbarError.value = true;
  }
  emit('result', true);
  localEnable.value = false;
}
</script>

<template>
  <v-dialog
      v-model="localEnable"
      max-width="550"
      persistent
  >
    <v-card
        prepend-icon="mdi-information"
        title="Ajout à la carte"
    >
      <v-select label="Type d'élément à ajouter"
                :items="Object.values(MenuElements)"
                v-model="selectedElementType"
                item-title="name"
                item-value="value"
                variant="outlined"
                density="compact"
                color="primary"
                rounded="xl"
                class="input-spacing mx-6"/>
      <div class="mx-6">
        <div v-if="selectedElementType === MenuElements.CATEGORY">
          <CategoryForm :handle-submit="handleSubmit"/>
        </div>
        <div v-else-if="selectedElementType === MenuElements.SUBCATEGORY">
          <SubCategoryForm :handle-submit="handleSubmit"/>
        </div>
        <div v-else-if="selectedElementType === MenuElements.ADDON">
          <AddonForm :handle-submit="handleSubmit"/>
        </div>
        <div v-else-if="selectedElementType === MenuElements.INGREDIENT">
          <IngredientForm :handle-submit="handleSubmit"/>
        </div>
        <div v-else-if="selectedElementType === MenuElements.PRODUCT">
          <ProductForm :handle-submit="handleSubmit"/>
        </div>
        <div v-else-if="selectedElementType === MenuElements.MENU">
          <MenuForm :handle-submit="handleSubmit"/>
        </div>
      </div>
      <v-card-actions>
        <v-btn @click="handleCancel">
          Annuler
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>
  <SuccessInfo :text="succesText" :enable="snackbarSuccess" @onClose="(v) => snackbarSuccess = v"/>
  <HintInfo :text="infoText" :enable="snackbarInfo" @onClose="(v) => snackbarInfo = v"/>

</template>

<style scoped>

</style>