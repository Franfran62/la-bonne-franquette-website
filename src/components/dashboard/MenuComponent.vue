<script setup>

import {computed, onBeforeMount, ref, watch} from "vue";
import InfiniteLoader from "@/components/loaders/InfiniteLoader.vue";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import {useDisplay} from "vuetify";
import MenuElements from "@/model/MenuElements.js";
import MenuEditListComponent from "@/components/lists/MenuEditListComponent.vue";
import {deleteElement, fetchElements} from "@/services/menuEditService.js";
import AlertDeleteDialog from "@/components/dialogs/AlertDeleteDialog.vue";
import SuccessInfo from "@/components/snackbars/SuccessInfo.vue";
import AddToRestaurantDialog from "@/components/dialogs/AddToRestaurantDialog.vue";
import HintInfo from "@/components/snackbars/HintInfo.vue";
import MenuEditComponent from "@/components/dashboard/MenuEditComponent.vue";

const isLoading = ref(true);

const snackbarError = ref(false);
const snackbarSuccess = ref(false);
const deleteConfirmDialog = ref(false);
const creationDialog = ref(false);
const snackbarInfo = ref(false);

const errorText = ref("");
const succesText = ref("");
const infoText = ref("");

const {xs, sm} = useDisplay();
const isMobile = computed(() => xs.value || sm.value);
const selectedMenuElement = ref(MenuElements.CATEGORY);
const selectedElement = ref(null);
const selectedElementToDelete = ref(null);

const elements = ref([]);

onBeforeMount(async () => {
  try {
    elements.value = await fetchElements(selectedMenuElement.value);
    isLoading.value = false;
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }

});

const onRefresh = async () => {
  elements.value = await fetchElements(selectedMenuElement.value);
}

watch(selectedMenuElement, (newV) => {
  onRefresh();
  selectedElement.value = null;
})

watch(selectedElement, (newV, oldV) => {
})
const onDelete = (elementToDelete) => {
  if (!elementToDelete) {
    infoText.value = "Sélectionner un élément pour le supprimer.";
    snackbarInfo.value = true;
    return;
  }
  selectedElementToDelete.value = elementToDelete;
  console.log(elementToDelete);
  console.log(selectedElementToDelete.value)
  deleteConfirmDialog.value = true;
}

const updateDelete = async (result) => {
  if (!result) {
    selectedElementToDelete.value = null;
    return (deleteConfirmDialog.value = false);
  }
  try {
    const response = await deleteElement(selectedMenuElement.value, selectedElementToDelete.value);
    if (response.status !== 200) throw new Error(response.message);
    succesText.value = response.data["Response"];
    snackbarSuccess.value = true;
    selectedElementToDelete.value = null;
    await onRefresh();
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
    selectedElementToDelete.value = null;
  } finally {
    deleteConfirmDialog.value = false;
    selectedElementToDelete.value = null;
  }
};

const onSelect = (newElement) => {
  if (selectedElement.value === null) {
    selectedElement.value = newElement;
  } else {
    if (newElement !== selectedElement.value) {
      selectedElement.value = newElement;
    } else {
      selectedElement.value = null;
    }
  }
}

const showAddToRestaurantDialog = () => {
  creationDialog.value = true;
}

const updateCreation = async (result) => {
  if (result) {
    await onRefresh();
  }
  return (creationDialog.value = false);
}

const updateModification = async (result) => {
  if (result) {
    selectedElement.value = null;
    await onRefresh();
  }
}

</script>

<template>
  <div v-if="isLoading">
    <InfiniteLoader class="flex justify-center align-center h-screen"/>
  </div>
  <div v-else>
    <v-card variant="text" class="flex justify-center mx-auto">
      <v-card-title>Carte du restaurant</v-card-title>
    </v-card>
    <div :class="{'flex flex-column-reverse': isMobile, 'flex justify-center': !isMobile}">
      <v-card :width="isMobile ? 400 : 700" variant="text" :class="{'mx-auto': isMobile }">
        <v-card-title v-show="!isMobile">Sélectionner un élément</v-card-title>
        <div>
          <v-card-actions :class="{'flex justify-space-between': !isMobile}">
            <v-btn-toggle
                v-if="!isMobile"
                v-model="selectedMenuElement"
                color="primary"
                mandatory
                variant=flat
                :class="{'': !isMobile, 'flex flex-wrap': isMobile}"
            >
              <v-btn :value="MenuElements.MENU" rounded="lg">{{ MenuElements.MENU }}</v-btn>
              <v-btn :value="MenuElements.PRODUCT" rounded="lg">{{ MenuElements.PRODUCT }}</v-btn>
              <v-btn :value="MenuElements.ADDON" rounded="lg">{{ MenuElements.ADDON }}</v-btn>
              <v-btn :value="MenuElements.INGREDIENT" rounded="lg">{{ MenuElements.INGREDIENT }}</v-btn>
              <v-btn :value="MenuElements.CATEGORY" rounded="lg">{{ MenuElements.CATEGORY }}</v-btn>
            </v-btn-toggle>
            <v-select v-else label="Catégories à modifier" :items="Object.values(MenuElements)"
                      v-model="selectedMenuElement" item-title="name" item-value="value"
                      variant="outlined" density="compact" color="primary"
                      rounded="xl" class="input-spacing"/>
            <span>
              <v-btn base-color="success" variant="text" icon="mdi-plus"
                     @click="showAddToRestaurantDialog">
            </v-btn>
            <v-btn @click="onRefresh" icon="mdi-refresh" variant="text"></v-btn>
            </span>

          </v-card-actions>
          <MenuEditListComponent :elements="elements" :on-select="onSelect" :on-delete="onDelete"/>
        </div>
      </v-card>

      <v-card :width="isMobile ? 400 : 700" variant="text"
              :class="{'px-8': !isMobile, 'flex justify-center': isMobile }">
        <MenuEditComponent :selectedElementType="selectedMenuElement" :element="selectedElement"
                           @result="updateModification"/>
      </v-card>
    </div>

  </div>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>
  <SuccessInfo :text="succesText" :enable="snackbarSuccess" @onClose="(v) => snackbarSuccess = v"/>
  <HintInfo :text="infoText" :enable="snackbarInfo" @onClose="(v) => snackbarInfo = v"/>
  <AlertDeleteDialog :title="'Vous allez supprimer quelque chose.'"
                     :body="(selectedMenuElement === MenuElements.CATEGORY) ?
                     `Vous êtes sur le point de supprimer ${ selectedElementToDelete?.name }. Supprimer une catégorie entrainera la suppression de toutes ses sous-catégories, êtes-vous sûr ?` :
                     `Vous êtes sur le point de supprimer ${ selectedElementToDelete?.name }, êtes-vous sûr ?`"
                     :enable="deleteConfirmDialog"
                     @result="updateDelete"/>
  <AddToRestaurantDialog :enable="creationDialog" @result="updateCreation"/>
</template>

<style scoped>

</style>