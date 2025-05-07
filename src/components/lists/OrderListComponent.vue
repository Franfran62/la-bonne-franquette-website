<script setup>
import Status from "@/model/Status.js";

defineProps({
  onDelete: {
    type: Function,
    required: true,
  },
  onSelect: {
    type: Function,
    required: true,
  },
  onFilter: {
    type: Function,
    required: true,
  },
});
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
        height="32"
        class="flex justify-space-around my-2 mx-2"
        @click="onSelect(order)"
    >
      <v-list-item-title class="flex justify-space-between">
        <span class="flex justify-around">
          <span class="mx-2">
            Commande n°{{ order.getNumeroToString() }}
          </span>
          <span class="mx-2">
            {{ order.getDateSaisieToString() }}
          </span>
          <span class="mx-2">
            {{ order.getNbArticlesToString() }} Articles
          </span>
          <span class="mx-2">
            Prix : {{ order.getPrixTTCToString() }}€
          </span>
        </span>
        <span class="flex justify-end">
        <v-icon color="white" variant="text" :icon="order.surPlace ? 'mdi-table-chair' : 'mdi-shopping'" class="mx-1"/>
        <v-icon color="white" variant="text"
                :icon="order.status === Status.TERMINEE ? 'mdi-check' : ( order.status === Status.ANNULEE ? 'mdi-cancel' : 'mdi-clock')" class="mx-1"/>
        <v-icon color="white" variant="text" :icon="order.paye ? 'mdi-currency-eur' : 'mdi-currency-eur-off'" class="mx-1"/>
        <v-icon color="white" variant="text" icon="mdi-delete" @click="onDelete(order)"/>
        </span>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>