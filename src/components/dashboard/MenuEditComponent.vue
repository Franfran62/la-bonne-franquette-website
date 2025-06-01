<script setup>
import MenuElements from "@/model/MenuElements.js";
import CategoryForm from "@/components/forms/CategoryForm.vue";
import SubCategoryForm from "@/components/forms/SubCategoryForm.vue";
import AddonForm from "@/components/forms/AddonForm.vue";
import IngredientForm from "@/components/forms/IngredientForm.vue";
import ProductForm from "@/components/forms/ProductForm.vue";
import MenuForm from "@/components/forms/MenuForm.vue";
import {computed, defineProps, onBeforeMount, ref, watch} from "vue";
import {useDisplay} from "vuetify";

const props = defineProps({
  selectedElementType: {
    type: MenuElements,
    required: true
  },
  element: {
    type: Object,
    default: () => ({}),
    required: false
  }
});

onBeforeMount(() => {
  console.log(props.element);
  checkCategoryType();
});

const checkCategoryType = () => {
  if (props.selectedElementType === MenuElements.CATEGORY) {
    if (props.element !== null && props.element.categoryType === "sub-category") {
      elementType.value = MenuElements.SUBCATEGORY;
      return;
    }
  }
  elementType.value = props.selectedElementType;
};

watch(() => props.element, () => {
  console.log(props.element);
  checkCategoryType();
});

const {xs, sm} = useDisplay();
const isMobile = computed(() => xs.value || sm.value);
const elementType = ref(null);

const handleSubmit = () => {
  console.log(elementType.value)
  console.log(props.element);

}

</script>

<template>

  <div v-if="props.element === null">
    <v-card-title :class="{'text-center': isMobile}"><span
        class="text-xl">Sélectionner un élément pour le modifier</span></v-card-title>
  </div>
  <div v-else>
    <div v-if="elementType === MenuElements.CATEGORY">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'une catégorie</span></v-card-title>
      <CategoryForm :handle-submit="handleSubmit"/>
    </div>
    <div v-else-if="elementType === MenuElements.SUBCATEGORY">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'une sous-catégorie</span></v-card-title>
      <SubCategoryForm :handle-submit="handleSubmit"/>
    </div>
    <div v-else-if="elementType === MenuElements.ADDON">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'un extra</span></v-card-title>
      <AddonForm :handle-submit="handleSubmit"/>
    </div>
    <div v-else-if="elementType === MenuElements.INGREDIENT">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'un ingrédient</span></v-card-title>
      <IngredientForm :handle-submit="handleSubmit"/>
    </div>
    <div v-else-if="elementType === MenuElements.PRODUCT">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'un produit</span></v-card-title>
      <ProductForm :handle-submit="handleSubmit"/>
    </div>
    <div v-else-if="elementType === MenuElements.MENU">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'un menu</span></v-card-title>
      <MenuForm :handle-submit="handleSubmit"/>
    </div>

  </div>


</template>

<style scoped></style>