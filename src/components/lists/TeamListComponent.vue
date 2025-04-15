<script setup>
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
      v-for="(u, i) in onFilter()"
      :key="i"
      color="primary"
      base-color="primary"
      rounded="lg"
      variant="elevated"
      min-height="32"
      height="32"
      class="flex justify-space-around my-2 mx-2"
      @click="onSelect(u)"
    >
      <v-list-item-title class="flex justify-space-between">
        {{ u.username }}
        <v-icon color="white" variant="text" icon="mdi-delete" @click="onDelete(u)" />
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>