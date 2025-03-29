<script setup>
import { defineProps, ref, watch } from "vue";

const props = defineProps({
  text: {
    type: String
  },
  enable: {
    type: Boolean
  },
  color: {
    type: String,
    default: "info"
  },
  timeout: {
    type: Number,
    default: 2500
  }
});

const emit = defineEmits(['onClose']);

const localEnable = ref(props.enable);

watch(() => props.enable, (newVal) => {
  localEnable.value = newVal;
});

watch(() => localEnable.value, () => {
  if (!localEnable.value) emit('onClose', false);
});

const onTimeout = () => {
  localEnable.value = false;
};
</script>

<template>
  <v-snackbar
    v-model="localEnable"
    :color="color"
    :timeout="timeout"
    @change="onTimeout"
  >
    <div class="text-white">
      {{ text }}
    </div>
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="localEnable = false"
      >
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>