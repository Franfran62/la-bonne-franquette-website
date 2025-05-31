<script setup>

import {computed, defineProps, ref, watch} from "vue";
import MenuElements, {getEnumKeyByValue} from "@/model/MenuElements.js";
import CategoryForm from "@/components/forms/CategoryForm.vue";
import SubCategoryForm from "@/components/forms/SubCategoryForm.vue";
import AddonForm from "@/components/forms/AddonForm.vue";
import IngredientForm from "@/components/forms/IngredientForm.vue";
import ProductForm from "@/components/forms/ProductForm.vue";
import MenuForm from "@/components/forms/MenuForm.vue";

const props = defineProps({
  enable: {
    type: Boolean
  },
});
const emit = defineEmits(['result'])

const localEnable = ref(props.enable);
const selectedElementType = ref(MenuElements.CATEGORY);

watch(() => props.enable, (newVal) => {
  localEnable.value = newVal;
});

watch(selectedElementType, (newVal) => {
  console.log(newVal);
});

const selectedElementTypeKey = computed(() => {
  return getEnumKeyByValue(MenuElements, selectedElementType.value);
})

const handleCancel = () => {
  emit('result', false);
  localEnable.value = false;
}

const handleSubmit = (data) => {
  console.log(data);
  //TODO: Ajouter le call de l'api ici
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
</template>

<style scoped>

</style>