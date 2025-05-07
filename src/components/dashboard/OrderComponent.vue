<script setup>

import OrderListComponent from "@/components/lists/OrderListComponent.vue";
import {computed, onBeforeMount, ref} from "vue";
import {fetchOrders} from "@/services/orderService.js";
import Order from "@/model/Order.js";
import {useDisplay} from "vuetify";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";

const snackbarError = ref(false);
const errorText = ref("");

const orders = ref([]);
const selectedOrder = ref(null);
const {xs, sm, md, lg, xl} = useDisplay();

onBeforeMount(() => refreshOrders());

const isMobile = computed(() => xs.value || sm.value);

const onFilter = computed(() => {
  return orders.value;
})

const refreshOrders = async () => {
  try {
    const response = await fetchOrders();
    if (response.status !== 200) throw new Error(response.message);
    console.log("Response : ")
    console.log(response.data);
    orders.value = response.data.map(order => new Order(order.commandeId, order.numero, order.prixTTC, order.surPlace, order.status, order.paiementTypeCommande, order.dateSaisie, order.dateLivraison, order.articles, order.nbArticle, order.menus, order.paiementSet, order.paye));
    selectedOrder.value = null;
  } catch (e) {
    console.log(e);
    errorText.value = e.message;
    snackbarError.value = true;
  }
}

</script>

<template>
  <v-card variant="text" class="flex justify-center mx-auto">
    <v-card-title>Commandes</v-card-title>
  </v-card>
  <div :class="{'flex flex-column-reverse': isMobile, 'flex justify-center': !isMobile}">
    <v-card :width="isMobile ? 400 : 700" variant="text" :class="{'mx-auto': isMobile }">
      <v-card-title v-show="!isMobile">Résumé des commandes</v-card-title>
      <div>
        <v-card-actions :class="{'flex justify-start': !isMobile}">
          <span class="ml-14" v-show="!isMobile">Trier par : </span>
          <v-select label="Role" :items="availableRoles" v-model="selectedRole" item-title="name" item-value="value"
                    clearable variant="outlined" density="compact" color="accent" rounded="xl"
                    :width="!isMobile ? 225: 25"
                    class="mt-6"/>
          <v-btn @click="refreshOrders" icon="mdi-refresh" variant="text"></v-btn>
        </v-card-actions>
        <OrderListComponent :on-filter="() => onFilter" :on-select="() => {}" :on-delete="() => {}"/>
      </div>
    </v-card>

    <v-card :width="isMobile ? 400 : 700" variant="text" :class="{'px-8': !isMobile, 'px-8 mx-auto': isMobile }">
      <v-card-title>Affichage</v-card-title>
    </v-card>
  </div>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>

</template>

<style scoped>

</style>