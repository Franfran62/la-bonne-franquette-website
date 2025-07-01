<script setup>

const props = defineProps({
  elements: {
    type: Array,
    required: true,
  },
  onSelect: {
    type: Function,
    required: false,
  },
  onDelete: {
    type: Function,
    required: false,
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
        <span>
          <v-icon v-if="onDelete && element.categories?.length <= 0" color="white" variant="text" icon="mdi-alert"/>
          <v-icon v-if="onDelete" color="white" variant="text" icon="mdi-delete" @click="onDelete(element)"/>
        </span>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>