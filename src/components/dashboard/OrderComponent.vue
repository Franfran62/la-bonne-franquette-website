<script setup>

import OrderListComponent from "@/components/lists/OrderListComponent.vue";
import {computed, onBeforeMount, ref, watch} from "vue";
import {fetchOrders} from "@/services/orderService.js";
import Order from "@/model/Order.js";
import {useDisplay} from "vuetify";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import DateRange from "@/model/DateRange.js";
import InfiniteLoader from "@/components/loaders/InfiniteLoader.vue";
import ProductListComponent from "@/components/lists/ProductListComponent.vue";
import Product from "@/model/Product.js";
import Payment from "@/model/Payment.js";
import PaymentListComponent from "@/components/lists/PaymentListComponent.vue";
import Menu from "@/model/Menu.js";
import MenuListComponent from "@/components/lists/MenuListComponent.vue";

const today = new Date();
const isLoading = ref(true);
onBeforeMount(() => refreshOrders());

const snackbarError = ref(false);
const errorText = ref("");

const selectedDateRange = ref(DateRange.ALL);

const orders = ref([]);
const selectedOrder = ref(null);
const {xs, sm, md} = useDisplay();
const isMobile = computed(() => xs.value || sm.value || md.value);
const products = ref([])
const payments = ref([])
const menus = ref([])

watch(selectedOrder, (newValue) => {
  if (!newValue) {
    selectedOrder.value = null;
    products.value = [];
    payments.value = []
  } else {
    products.value = selectedOrder.value?.articles.map(
        a => new Product(a['name'], a['totalPrice'], a['ingredients'], a['addons'], a['modified'], a["quantity"])
    );
    payments.value = selectedOrder.value?.payments.map(
        p => new Payment(p['price'],p["type"],p['paid'],p['date'])
    );
    menus.value = selectedOrder.value?.menus.map(
        m => new Menu(m['name'],m["totalPrice"],m['articles'],m['modified'], m["quantity"])
    );
  }
});

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear + (firstDayOfYear.getDay() || 7) * 86400000) / 86400000;
  return Math.ceil(pastDaysOfYear / 7);
}

const isSameDay = (date1, date2) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

const isSameMonth = (date1, date2) =>
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

const onFilter = computed(() => {
  const filters = {
    [DateRange.ALL]: () => orders.value,
    [DateRange.TODAY]: () => orders.value.filter(order => isSameDay(order.creationDate, today)),
    [DateRange.WEEK]: () => orders.value.filter(order => getWeekNumber(order.creationDate) === getWeekNumber(today)),
    [DateRange.MONTH]: () => orders.value.filter(order => isSameMonth(order.creationDate, today)),
    [DateRange.YEAR]: () => orders.value.filter(order => order.creationDate.getFullYear() === today.getFullYear()),
  };
  return filters[selectedDateRange.value]();
});


const refreshOrders = async () => {
  try {
    const response = await fetchOrders();
    orders.value = response.data.map(order => new Order(
        order.id,
        order.number,
        order.totalPrice,
        order.dineIn,
        order.status,
        order.paymentType,
        new Date(order.creationDate), order.deliveryDate ? new Date(order.deliveryDate) : null,
        order.articles,
        order.totalItems,
        order.menus,
        order.payments,
        order.paid));
    selectedOrder.value = null;
    isLoading.value = false;
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }
}

const handleSelectOrder = (order) => {
  if (order === selectedOrder.value) {
    selectedOrder.value = null;
    return;
  }
  selectedOrder.value = order;
}

const orderDisplayTitle = computed(
    () => (selectedOrder === null || selectedOrder.value === null)
        ? "Aucune commande sélectionnée"
        : "Commande n°" + selectedOrder.value.getNumeroToString() + " du " + selectedOrder.value.getDateSaisieToString());

</script>

<template>
  <div v-if="isLoading">
    <InfiniteLoader class="flex justify-center align-center h-screen"/>
  </div>
  <div v-else>
    <v-card variant="text" class="flex justify-center mx-auto">
      <v-card-title>Commandes</v-card-title>
    </v-card>
    <div :class="{'flex flex-column-reverse': isMobile, 'flex justify-center': !isMobile}">
      <v-card :width="isMobile ? 400 : 700" variant="text" :class="{'mx-auto': isMobile }">
        <v-card-title v-show="!isMobile">Résumé des commandes</v-card-title>
        <div>
          <v-card-actions :class="{'flex justify-space-between': !isMobile}">
            <v-btn-toggle
                v-if="!isMobile"
                v-model="selectedDateRange"
                color="primary"
                mandatory
                variant=flat
                :class="{'': !isMobile, 'flex flex-wrap': isMobile}"
            >
              <v-btn :value="DateRange.ALL" rounded="lg">{{ DateRange.ALL }}</v-btn>
              <v-btn  :value="DateRange.TODAY" rounded="lg">{{ DateRange.TODAY }}</v-btn>
              <v-btn  :value="DateRange.WEEK" rounded="lg">{{ DateRange.WEEK }}</v-btn>
              <v-btn  :value="DateRange.MONTH" rounded="lg">{{ DateRange.MONTH }}</v-btn>
              <v-btn  :value="DateRange.YEAR" rounded="lg">{{ DateRange.YEAR }}</v-btn>
            </v-btn-toggle>
            <v-select v-else label="Plage des commandes" :items="Object.values(DateRange)" v-model="selectedDateRange" item-title="name" item-value="value"
                      variant="outlined" density="compact" color="primary"
                      rounded="xl" class="input-spacing"/>
            <v-btn @click="refreshOrders" icon="mdi-refresh" variant="text"></v-btn>
          </v-card-actions>
          <OrderListComponent :on-filter="() => onFilter" :on-select="handleSelectOrder"/>
        </div>
      </v-card>

      <v-card :width="isMobile ? 400 : 700" variant="text" :class="{'px-8': !isMobile, 'flex justify-center': isMobile }">
        <v-card-title :class="{'text-center': isMobile}"><span class="text-xl">{{ orderDisplayTitle }}</span></v-card-title>
        <v-card-subtitle v-show="selectedOrder && selectedOrder.value !== null">{{"Prix : "+selectedOrder?.getPriceToString()+" €"}}</v-card-subtitle>
        <div :class="{'mx-2': !isMobile, 'my-2 mx-2': isMobile}">
            <ProductListComponent :products="products" />
            <MenuListComponent :menus="menus" />
            <PaymentListComponent :payments="payments" />
        </div>
      </v-card>
    </div>
  </div>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>

</template>

<style scoped>

</style>