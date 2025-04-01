<script setup>
import {defineProps, ref, watch} from "vue";

const props = defineProps({
  title: {
    type: String
  },
  body: {
    type: String
  },
  enable: {
    type: Boolean
  },
});

const emit = defineEmits(['result'])

const localEnable = ref(props.enable);

watch(() => props.enable, (newVal) => {
  localEnable.value = newVal;
});

const handleAccept = () => {
  emit('result', true);
  localEnable.value = false;
}

const handleCancel = () => {
  emit('result', false);
  localEnable.value = false;
}

</script>
<template>
  <v-dialog
      v-model="localEnable"
      max-width="450"
      persistent
  >
    <v-card
        prepend-icon="mdi-alert"
        :title="title"
        :text="body"
    >
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn @click="handleCancel">
          Non
        </v-btn>
        <v-btn @click="handleAccept">
          Oui
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>