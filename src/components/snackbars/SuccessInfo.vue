<script setup>
import SnackbarBase from './SnackbarBase.vue';
import { defineProps } from "vue";

const props = defineProps({
  text: {
    type: String
  },
  enable: {
    type: Boolean
  }
});
</script>

<template>
  <SnackbarBase :text="text" :enable="enable" color="success" @onClose="$emit('onClose', $event)" />
</template>