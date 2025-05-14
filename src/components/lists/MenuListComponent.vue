<script setup>
defineProps({
  menus: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div v-show="menus !== null && menus.length > 0">
    <div class="">Menus :</div>
    <v-list>
      <v-list-item
          v-for="(m, i) in menus"
          :key="i"
          :color="m.modified ? 'editedProduct' : 'nonEditedProduct'"
          :base-color="m.modified ? 'editedProduct' : 'nonEditedProduct'"
          rounded="lg"
          variant="elevated"
          min-height="32"
          class="flex justify-space-around my-2 mx-2"
      >
        <v-card :color="m.modified ? 'editedProduct' : 'nonEditedProduct'">
          <v-card-item>
            <v-card-title>
            <span class="text-base">
            {{ m.name }}
            </span>
            </v-card-title>
            <v-card-subtitle>
              <div>
                Quantité: {{ m.quantity }}
              </div>
              <div>
                Prix: {{ m.getPriceToString() + '€' }}
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