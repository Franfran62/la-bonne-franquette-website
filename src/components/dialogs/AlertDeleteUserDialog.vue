<script setup>
import {defineProps, ref, watch} from "vue";

const props = defineProps({
  username: {
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
  console.log("expected result : true")
  localEnable.value = false;
}

const handleCancel = () => {
  emit('result', false);
  console.log("expected result : false")
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
        title="Vous allez supprimer un utilisateur.">
      <v-card-text>
        Vous êtes sur le point de supprimer l'utilisateur {{ props.username }}, êtes-vous sûr ?
      </v-card-text>
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