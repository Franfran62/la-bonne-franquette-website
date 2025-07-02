<script setup>

import AddToRestaurantDialog from "@/components/dialogs/AddToRestaurantDialog.vue";
import MenuEditListComponent from "@/components/lists/MenuEditListComponent.vue";
import InfiniteLoader from "@/components/loaders/InfiniteLoader.vue";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import HintInfo from "@/components/snackbars/HintInfo.vue";
import SuccessInfo from "@/components/snackbars/SuccessInfo.vue";
import MenuElements from "@/model/MenuElements.js";
import PaymentType from "@/model/PaymentType";
import { createNewElement, fetchElements } from "@/services/menuEditService.js";
import { getRestauratnName, editRestaurantName } from "@/services/restaurantService";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useDisplay } from "vuetify";

const isLoading = ref(true);

const snackbarError = ref(false);
const snackbarSuccess = ref(false);
const creationDialog = ref(false);
const snackbarInfo = ref(false);

const errorText = ref("");
const succesText = ref("");
const infoText = ref("");

const { xs, sm, md } = useDisplay();
const isMobile = computed(() => xs.value || sm.value || md.value);

const paymentsType = ref([]);
const paymentName = ref("");
const restaurantName = ref("");
const originalRestaurantName = ref("");

onBeforeMount(async () => {
  try {
    paymentsType.value = await fetchElements(MenuElements.PAYMENT_TYPE);
    restaurantName.value = await getRestauratnName();
    originalRestaurantName.value = restaurantName.value;
    isLoading.value = false;
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }

});

const handleSubmitNewPayementMethod = async () => {

  isLoading.value = true;

  if (paymentName.value.trim() === "") {
    errorText.value = "Le nom du type de paiement ne peut pas être vide.";
    snackbarError.value = true;
    isLoading.value = false;
    return;
  }

  try {
    let newPaymentType = new PaymentType(null, paymentName.value.trim(), true);
    const response = await createNewElement(MenuElements.PAYMENT_TYPE, newPaymentType);
    isLoading.value = false;
    if (response.status === 200) {
      paymentsType.value.push(newPaymentType);
      succesText.value = "Le type de paiement a été ajouté avec succès.";
      snackbarSuccess.value = true;
      paymentName.value = "";
    } else {
      throw new Error(response.data.message);
    }
  } catch (e) {
    isLoading.value = false;
    errorText.value = e.message;
    snackbarError.value = true;
  }
}

const handleEditRestaurantName = async () => { 
  if (restaurantName.value.trim() === "" || restaurantName.value === originalRestaurantName.value) return;
  try {
    const response = await editRestaurantName(restaurantName.value);
    if (response.status === 200) {
      originalRestaurantName.value = restaurantName.value;
      succesText.value = "Le restaurant a été renommé avec succès.";
      snackbarSuccess.value = true;
    } else {
      throw new Error(response.data.message);
    }
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }
}
</script>

<template>
  <div v-if="isLoading">
    <InfiniteLoader class="flex justify-center align-center h-screen" />
  </div>
  <div v-else class="pt-4">
    <div :class="{ 'flex flex-column-reverse': isMobile, 'flex justify-center': !isMobile }">
      <v-card :width="isMobile ? 400 : 700" variant="text" :class="{ 'mx-auto': isMobile }">
        <v-card-title> Nom du restaurent</v-card-title>
        <v-form :class="{ 'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile }" validate-on="invalid-input"
          @submit.prevent="handleEditRestaurantName">
          <v-text-field v-model="restaurantName" label="Nom de restaurant"
            placeholder="Entrez le nom de votre restaurant" variant="outlined"
            :rules="[v => !!v || 'Le nom est nécessaire']" required rounded="xl" density="compact" class="input-spacing"
            color="primary" />

          <div :class="{ 'd-flex justify-center pb-8': !isMobile, 'd-flex justify-center': isMobile }">
            <v-btn type="submit" color="primary" rounded="xl" :size="isMobile ? 'default' : 'large'">
              <div class="justify-start font-semibold">Modifier</div>
            </v-btn>
          </div>
        </v-form>
        <v-card-title>Les modes de paiements autorisés</v-card-title>
        <MenuEditListComponent :elements="paymentsType" />
        <v-card-title>Ajouter un nouveau mode de paiement</v-card-title>
        <v-form :class="{ 'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile }" validate-on="invalid-input"
          @submit.prevent="handleSubmitNewPayementMethod">
          <v-text-field v-model="paymentName" label="Nom du type de paiement"
            placeholder="Entrez un nouveau nom de type de paiement" variant="outlined"
            :rules="[v => !!v || 'Le nom est nécessaire']" required rounded="xl" density="compact" class="input-spacing"
            color="primary" />

          <div :class="{ 'd-flex justify-center pb-8': !isMobile, 'd-flex justify-center': isMobile }">
            <v-btn type="submit" color="primary" rounded="xl" :size="isMobile ? 'default' : 'large'">
              <div class="justify-start font-semibold">Ajouter</div>
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>

  </div>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v" />
  <SuccessInfo :text="succesText" :enable="snackbarSuccess" @onClose="(v) => snackbarSuccess = v" />
  <HintInfo :text="infoText" :enable="snackbarInfo" @onClose="(v) => snackbarInfo = v" />
  <AddToRestaurantDialog :enable="creationDialog" @result="updateCreation" />
</template>

<style scoped></style>