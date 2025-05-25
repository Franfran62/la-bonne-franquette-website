<script setup>
import Status from "@/model/Status.js";
import {useDisplay} from "vuetify";
import {computed} from "vue";

defineProps({
  elements: {
    type: Array,
    required: true,
  },
  onSelect: {
    type: Function,
    required: true,
  },
  onDelete: {
    type: Function,
    required: true,
  }
});

</script>

<template>
  <v-list>
    <v-list-item
        v-for="(element, i) in elements"
        :key="i"
        color="primary"
        base-color="primary"
        rounded="lg"
        variant="elevated"
        min-height="32"

        class="flex justify-space-around my-2 mx-2 flex-wrap"
        @click="onSelect(element)"
    >
      <v-list-item-title class="flex justify-space-between">
        {{ element.name }}
        <v-icon color="white" variant="text" icon="mdi-delete" @click="onDelete(element)" />
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>