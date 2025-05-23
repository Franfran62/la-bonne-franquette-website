<script setup>
defineProps({
  products: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div v-show="products !== null && products.length > 0">
    <div class="">Articles :</div>
    <v-list>
      <v-list-item
          v-for="(p, i) in products"
          :key="i"
          :color="p.modified ? 'editedProduct' : 'nonEditedProduct'"
          :base-color="p.modified ? 'editedProduct' : 'nonEditedProduct'"
          rounded="lg"
          variant="elevated"
          min-height="32"
          class="flex justify-space-around my-2 mx-2"
      >

        <v-card :color="p.modified ? 'editedProduct' : 'nonEditedProduct'">
          <v-card-item>
            <v-card-title>
            <span class="text-base">
            {{ p.name }}
            </span>
            </v-card-title>
            <v-card-subtitle>
              <div>
                Quantité: {{ p.quantity }}
              </div>
              <div>
                {{ 'Prix : ' + p.getPriceToString() + '€' }}
              </div>
            </v-card-subtitle>
          </v-card-item>
          <div v-show="p.modified">
            <div class="flex flex-wrap mx-6 mb-4 justify-start">
              <div class="text-sm" :class="{'mr-2': p.ingredients.length > 0 && p.addons.length > 0}"
                   v-show="p.ingredients.length > 0">Ingrédients retirés :
                {{ p.ingredients.map(x => x['nom']).join(', ') }}
              </div>
              <div class="text-sm" v-show="p.addons.length > 0">Extras : {{
                  p.addons.map(x => x['nom']).join(', ')
                }}
              </div>
            </div>
          </div>
        </v-card>
      </v-list-item>
    </v-list>
  </div>
</template>

<style>
</style>