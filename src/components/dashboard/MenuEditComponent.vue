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
import Ingredients from "@/model/Ingredients.js";
import Category from "@/model/Category.js";
import SubCategory from "@/model/SubCategory.js";
import Addon from "@/model/Addon.js";
import Product from "@/model/Product.js";
import Menu from "@/model/Menu.js";

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
  checkCategoryType();
  console.log(props.element)
});

const {xs, sm} = useDisplay();
const isMobile = computed(() => xs.value || sm.value);
const elementType = ref(null);

const handleSubmit = (data) => {
  data.id = props.element.id;
  console.log("avant : ")
  console.log(props.element);
  console.log("après : ")
  console.log(data);

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
      <div :class="{'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile}">
        <CategoryForm
            :handle-submit="handleSubmit"
            :category="new Category(
                        props.element.id,
                        props.element.name,
                        props.element.products,
                        props.element.categoryType)"/>
      </div>
    </div>
    <div v-else-if="elementType === MenuElements.SUBCATEGORY">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'une sous-catégorie</span></v-card-title>
      <div :class="{'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile}">
        <SubCategoryForm
            :handle-submit="handleSubmit"
            :sub-category="new SubCategory(
                           props.element.id,
                           props.element.name,
                           props.element.products,
                           props.element.categoryId,
                           props.element.categoryType)"/>
      </div>
    </div>
    <div v-else-if="elementType === MenuElements.ADDON">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'un extra</span></v-card-title>
      <div :class="{'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile}">
        <AddonForm
            :handle-submit="handleSubmit"
            :addon="new Addon(
                     props.element.id,
                     props.element.name,
                     props.element.price,
                     props.element.vatRate,
                     props.element.ingredient)"/>
      </div>
    </div>
    <div v-else-if="elementType === MenuElements.INGREDIENT">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'un ingrédient</span></v-card-title>
      <div :class="{'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile}">
        <IngredientForm
            :handle-submit="handleSubmit"
            :ingredient="new Ingredients(
                          props.element.id,
                          props.element.name)"/>
      </div>
    </div>
    <div v-else-if="elementType === MenuElements.PRODUCT">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'un produit</span></v-card-title>
      <div :class="{'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile}">
        <ProductForm
            :handle-submit="handleSubmit"
            :product="new Product(
                       props.element.name,
                       props.element.price,
                       props.element.ingredients,
                       props.element.addons,
                       props.element.categories,
                       false,
                       0,
                       props.element.vatRate,
                       props.element.id)"/>
      </div>
    </div>
    <div v-else-if="elementType === MenuElements.MENU">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl">Modification d'un menu</span></v-card-title>
      <div :class="{'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile}">
        <MenuForm
            :handle-submit="handleSubmit"
            :menu="new Menu(
                    props.element.name,
                    props.element.price,
                    [],
                    false,
                    0,
                    props.element.menuItems,
                    props.element.vatRate,
                    props.element.id)"/>
      </div>
    </div>
  </div>

</template>

<style scoped></style>