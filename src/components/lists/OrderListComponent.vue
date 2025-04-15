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
        Commande n°{{ order.numero }} {{ order.dateSaisie }} {{ order.nbArticles }} Prix : {{ order.prixTTC }}€
        <v-icon color="white" variant="text" :icon="order.surPlace ? 'mdi-table-bar' : 'mdi-shopping'" />
        <v-icon color="white" variant="text" :icon="order.status === Status.TERMINEE ? 'mdi-ok' : ( order.status === Status.ANNULEE ? 'mdi-cancel' : 'mdi-clock')" />
        <v-icon color="white" variant="text" :icon="order.paye ? 'mdi-paid-on' : 'mdi-paid-off'" />
        <v-icon color="white" variant="text" icon="mdi-delete" @click="onDelete(order)" />
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>