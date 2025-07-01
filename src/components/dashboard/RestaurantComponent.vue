<script setup>

import {computed, onBeforeMount, ref, watch} from "vue";
import InfiniteLoader from "@/components/loaders/InfiniteLoader.vue";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import {useDisplay} from "vuetify";
import MenuElements from "@/model/MenuElements.js";
import MenuEditListComponent from "@/components/lists/MenuEditListComponent.vue";
import {createNewElement, deleteElement, fetchElements} from "@/services/menuEditService.js";
import AlertDeleteDialog from "@/components/dialogs/AlertDeleteDialog.vue";
import SuccessInfo from "@/components/snackbars/SuccessInfo.vue";
import AddToRestaurantDialog from "@/components/dialogs/AddToRestaurantDialog.vue";
import HintInfo from "@/components/snackbars/HintInfo.vue";
import MenuEditComponent from "@/components/dashboard/MenuEditComponent.vue";
import PaymentType from "@/model/PaymentType";

const isLoading = ref(true);

const snackbarError = ref(false);
const snackbarSuccess = ref(false);
const creationDialog = ref(false);
const snackbarInfo = ref(false);

const errorText = ref("");
const succesText = ref("");
const infoText = ref("");

const {xs, sm, md} = useDisplay();
const isMobile = computed(() => xs.value || sm.value || md.value);

const paymentsType = ref([]);
const name = ref("");

onBeforeMount(async () => {
  try {
    paymentsType.value = await fetchElements(MenuElements.PAYMENT_TYPE);
    isLoading.value = false;
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }

});

const handleSubmit = async () =>  {

  isLoading.value = true;

  if (name.value.trim() === "") {
    errorText.value = "Le nom du type de paiement ne peut pas être vide.";
    snackbarError.value = true;
    isLoading.value = false;
    return;
  }

  try {
    let newPaymentType = new PaymentType(null, name.value.trim(), true);
    const response  = await createNewElement(MenuElements.PAYMENT_TYPE, newPaymentType);
    isLoading.value = false;
    console.log(response);

    if(response.status === 200) {
      paymentsType.value.push(newPaymentType);
      succesText.value = "Le type de paiement a été ajouté avec succès.";
      snackbarSuccess.value = true;
      name.value = "";
    } else {
      throw new Error(response.data.message);
    }
  } catch (e) {
    isLoading.value = false;
    errorText.value = e.message;
    snackbarError.value = true;
  }
}

</script>

<template>
  <div v-if="isLoading">
    <InfiniteLoader class="flex justify-center align-center h-screen"/>
  </div>
  <div v-else class="pt-4">
    <div :class="{'flex flex-column-reverse': isMobile, 'flex justify-center': !isMobile}">
      <v-card :width="isMobile ? 400 : 700" variant="text" :class="{'mx-auto': isMobile }">
        <v-card-title>Les modes de paiements autorisés</v-card-title>
        <MenuEditListComponent :elements="paymentsType" />
        <v-card-title>Ajouter un nouveau mode de paiement</v-card-title>
        <v-form :class="{'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile}" validate-on="invalid-input" @submit.prevent="handleSubmit">
          <v-text-field v-model="name" label="Nom du type de paiement" placeholder="Entrez un nouveau nom de type de paiement"
                        variant="outlined" :rules="[v => !!v || 'Le nom est nécessaire']" required
                        rounded="xl" density="compact" class="input-spacing" color="primary"/>

          <div :class="{'d-flex justify-center pb-8': !isMobile, 'd-flex justify-center': isMobile}">
            <v-btn type="submit" color="primary" rounded="xl" :size="isMobile ? 'default' : 'large'">
              <div class="justify-start font-semibold">Ajouter</div>
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>

  </div>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>
  <SuccessInfo :text="succesText" :enable="snackbarSuccess" @onClose="(v) => snackbarSuccess = v"/>
  <HintInfo :text="infoText" :enable="snackbarInfo" @onClose="(v) => snackbarInfo = v"/>
  <AddToRestaurantDialog :enable="creationDialog" @result="updateCreation"/>
</template>

<style scoped>

</style>