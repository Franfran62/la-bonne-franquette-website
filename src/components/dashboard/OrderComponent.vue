<script setup>

import OrderListComponent from "@/components/lists/OrderListComponent.vue";
import {computed, onBeforeMount, ref} from "vue";
import {fetchOrders} from "@/services/orderService.js";
import Order from "@/model/Order.js";
import {useDisplay} from "vuetify";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import DateRange from "@/model/DateRange.js";

const today = new Date();

const snackbarError = ref(false);
const errorText = ref("");

const selectedDateRange = ref(DateRange.ALL);

const orders = ref([]);
const selectedOrder = ref(null);
const {xs, sm, md, lg, xl} = useDisplay();

onBeforeMount(() => refreshOrders());

const isMobile = computed(() => xs.value || sm.value);

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear + (firstDayOfYear.getDay() || 7) * 86400000) / 86400000;
  return Math.ceil(pastDaysOfYear / 7);
}


const onFilter = computed(() => {
  switch (selectedDateRange.value) {
    case DateRange.ALL : return orders.value;
    case DateRange.TODAY : return orders.value.filter(order => (order.dateSaisie.getDate() === today.getDate() && order.dateSaisie.getMonth() === today.getMonth() && order.dateSaisie.getFullYear() === today.getFullYear()));
    case DateRange.WEEK : return orders.value.filter(order => (getWeekNumber(order.dateSaisie) === getWeekNumber(today)));
    case DateRange.MONTH : return orders.value.filter(order => (order.dateSaisie.getMonth() === today.getMonth() && order.dateSaisie.getFullYear() === today.getFullYear()));
    case DateRange.YEAR : return orders.value.filter(order => (order.dateSaisie.getFullYear() === today.getFullYear()));
  }
})

const refreshOrders = async () => {
  try {
    const response = await fetchOrders();
    if (response.status !== 200) throw new Error(response.message);
    console.log("Response : ")
    console.log(response.data);
    orders.value = response.data.map(order => new Order(order.commandeId, order.numero, order.prixTTC, order.surPlace, order.status, order.paiementTypeCommande, new Date(order.dateSaisie), order.dateLivraison ? new Date(order.dateLivraison) : null, order.articles, order.nbArticle, order.menus, order.paiementSet, order.paye));
    selectedOrder.value = null;
  } catch (e) {
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
<!--        <div class="d-flex flex-column align-center">

        </div>-->
        <v-card-actions :class="{'flex justify-space-between': !isMobile}">
<!--          <span class="ml-14" v-show="!isMobile">Trier par : </span>
          <v-select label="Role" :items="availableRoles" v-model="selectedRole" item-title="name" item-value="value"
                    clearable variant="outlined" density="compact" color="accent" rounded="xl"
                    :width="!isMobile ? 225: 25"
                    class="mt-6"/>-->
          <v-btn-toggle
              v-model="selectedDateRange"
              color="primary"
              mandatory
              variant=flat
          >
            <v-btn :value="DateRange.ALL" rounded="lg">{{ DateRange.ALL }}</v-btn>
            <v-btn  :value="DateRange.TODAY" rounded="lg">{{ DateRange.TODAY }}</v-btn>
            <v-btn  :value="DateRange.WEEK" rounded="lg">{{ DateRange.WEEK }}</v-btn>
            <v-btn  :value="DateRange.MONTH" rounded="lg">{{ DateRange.MONTH }}</v-btn>
            <v-btn  :value="DateRange.YEAR" rounded="lg">{{ DateRange.YEAR }}</v-btn>
          </v-btn-toggle>
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