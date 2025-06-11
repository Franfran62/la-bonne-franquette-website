<script setup>
import Status from "@/model/Status.js";
import {useDisplay} from "vuetify";
import {computed} from "vue";

defineProps({
  onSelect: {
    type: Function,
    required: true,
  },
  onFilter: {
    type: Function,
    required: true,
  },
});

const {xs, sm, md} = useDisplay();
const isMobile = computed(() => xs.value || sm.value || md.value);
</script>

<template>
  <v-list>
    <v-list-item
        v-for="(order, i) in onFilter()"
        :key="i"
        color="primary"
        base-color="primary"
        rounded="lg"
        variant="elevated"
        min-height="32"

        class="flex justify-space-around my-2 mx-2 flex-wrap"
        @click="onSelect(order)"
    >
      <v-list-item-title :class="{'flex justify-space-between':!isMobile, 'flex flex-wrap':isMobile }">
        <div class="flex justify-around flex-wrap">
          <div class="mx-2">
            Commande n°{{ order.getNumeroToString() }}
          </div>
          <div class="mx-2">
            {{ order.getDateSaisieAndHourToString() }}
          </div>
          <div class="mx-2">
            {{ order.getNbArticlesToString() }} Article{{ order.totalItems > 1 ? "s" : "" }}
          </div>
          <div class="mx-2">
            Prix : {{ order.getPriceToString() }}€
          </div>
        </div>
        <div :class="{'flex justify-center mx-auto': isMobile, 'flex justify-end': !isMobile}">
        <v-icon color="white" variant="text" :icon="order.dineIn ? 'mdi-table-chair' : 'mdi-shopping'" class="mx-1"/>
        <v-icon color="white" variant="text"
                :icon="order.status === Status.TERMINEE ? 'mdi-check' : ( order.status === Status.ANNULEE ? 'mdi-cancel' : 'mdi-clock')" class="mx-1"/>
        <v-icon color="white" variant="text" :icon="order.paid ? 'mdi-currency-eur' : 'mdi-currency-eur-off'" class="mx-1"/>
        </div>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>