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
import SuccessInfo from "@/components/snackbars/SuccessInfo.vue";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import HintInfo from "@/components/snackbars/HintInfo.vue";
import {updateElement} from "@/services/menuEditService.js";

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

const emit = defineEmits(['result'])

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
});

const {xs, sm, md} = useDisplay();
const isMobile = computed(() => xs.value || sm.value || md.value);
const elementType = ref(null);

const snackbarError = ref(false);
const snackbarSuccess = ref(false);
const snackbarInfo = ref(false);

const errorText = ref("");
const succesText = ref("");
const infoText = ref("");

const handleSubmit = async (data) => {
  data.id = props.element.id;
  let response;
  if (data.categoryType === "sub-category") {
    response = await updateElement(MenuElements.SUBCATEGORY, data);
  } else {
    response = await updateElement(props.selectedElementType, data);
  }
  if (response.status === 200) {
    succesText.value = response.data["Response"];
    snackbarSuccess.value = true;
  } else {
    throw new Error(response.data.message);
  }
  emit('result', true);
}

</script>

<template>
  <div v-if="props.element === null">
    <v-card-title :class="{'text-center': isMobile}"><span
        class="text-xl text-wrap">Sélectionner un élément pour le modifier</span></v-card-title>
  </div>
  <div v-else>
    <div v-if="elementType === MenuElements.CATEGORY">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl text-wrap">Modification d'une catégorie</span></v-card-title>
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
          class="text-xl text-wrap">Modification d'une sous-catégorie</span></v-card-title>
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
          class="text-xl text-wrap">Modification d'un extra</span></v-card-title>
      <div :class="{'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile}">
        <AddonForm
            :handle-submit="handleSubmit"
            :addon="new Addon(
                     props.element.id,
                     props.element.name,
                     props.element.price,
                     props.element.vatrate,
                     props.element.ingredient)"/>
      </div>
    </div>
    <div v-else-if="elementType === MenuElements.INGREDIENT">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl text-wrap">Modification d'un ingrédient</span></v-card-title>
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
          class="text-xl etxt-wrap">Modification d'un produit</span></v-card-title>
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
                       props.element.vatrate,
                       props.element.id)"/>
      </div>
    </div>
    <div v-else-if="elementType === MenuElements.MENU">
      <v-card-title :class="{'text-center': isMobile}"><span
          class="text-xl text-wrap">Modification d'un menu</span></v-card-title>
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
                    props.element.vatrate,
                    props.element.id)"/>
      </div>
    </div>
  </div>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>
  <SuccessInfo :text="succesText" :enable="snackbarSuccess" @onClose="(v) => snackbarSuccess = v"/>
  <HintInfo :text="infoText" :enable="snackbarInfo" @onClose="(v) => snackbarInfo = v"/>

</template>

<style scoped></style>