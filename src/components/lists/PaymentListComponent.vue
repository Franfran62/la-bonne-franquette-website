<script setup>
defineProps({
  payments: {
    type: Array,
    required: true,
  },
});
</script>

<template>
<div v-show="payments !== null && payments.length > 0">
  <div class="">Paiements :</div>
  <v-list>
    <v-list-item
        v-for="(p, i) in payments"
        :key="i"
        :color="p.paid ? 'editedProduct' : 'nonEditedProduct'"
        :base-color="p.paid ? 'editedProduct' : 'nonEditedProduct'"
        rounded="lg"
        variant="elevated"
        min-height="32"
        class="flex justify-space-around my-2 mx-2"
    >

      <v-card :color="p.paid ? 'editedProduct' : 'nonEditedProduct'" variant="flat">
        <v-card-item>
          <v-card-title >
            <span class="text-base">
            {{ p.getPriceToString()+'€' }}
            </span>
          </v-card-title>
          <v-card-subtitle>
            <div>
              Le {{ p.getDateSaisieAndHourToString() }}
            </div>
            <div>
              {{ p.paymentType }}
            </div>
          </v-card-subtitle>
        </v-card-item>
      </v-card>
    </v-list-item>
  </v-list>
</div>

</template>

<style scoped>

</style>