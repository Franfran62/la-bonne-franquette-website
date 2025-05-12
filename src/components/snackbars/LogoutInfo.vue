<script setup>
import SnackbarBase from './SnackbarBase.vue';
import { defineProps } from "vue";

const props = defineProps({
  enable: {
    type: Boolean
  }
});
</script>

<template>
  <SnackbarBase :timeout="4000" :text="'Vous êtes déconnecté.'" :enable="enable" color="accent" @onClose="$emit('onClose', $event)" />
</template>