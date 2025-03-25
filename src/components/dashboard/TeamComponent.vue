<script setup>
import {fetchUsers} from "@/services/userService.js";
import {computed, onBeforeMount, ref} from "vue";
import User from "@/model/User.js";

const snackbarError = ref(false);
const errorText = ref("");
const users = ref([]);
const selectedUser = ref(null)
const selectedRole = ref(null)
const availableRoles = ["ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN"]

onBeforeMount(() => {
  refreshUsers();
})

const filterByRole = computed(() => {
  if (selectedRole.value === null || selectedRole.value === "") return users.value;
  return users.value.filter(user => user.roles.split(',').includes(selectedRole.value));
});

const handleSelectedUser = (user) => {
  selectedUser.value = user;
}

const refreshUsers = async () => {
  try {
    const response = await fetchUsers();
    if (response.status !== 200) {
      errorText.value = response.message;
      snackbarError.value = true;
      return;
    }

    response.data.forEach(user => {
      users.value.push(new User(user.id, user.username, user.restaurantId, user.roles));
    });
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }

}
</script>

<template>
  <v-card min-width="700" variant="text">
    <v-card-title>
      Gestion des membres de l'équipe
    </v-card-title>
    <v-card-actions class="flex justify-start">
        <v-btn base-color="greenBg" rounded="xl" variant="elevated" class="px-8">
        <span class="whiteText">
          Ajouter un membre
        </span>
        </v-btn>
      <span class="ml-16">Afficher les : </span>
        <v-select clearable label="Role" :items="availableRoles" v-model="selectedRole"
                  variant="outlined" density="compact"
                  rounded="xl" max-width="225" class="mt-6">
        </v-select>


    </v-card-actions>
    <v-list>
      <v-list-item v-for="(u, i) in filterByRole" :value="u" :key="i"
                   color="accent" base-color="primary"
                   rounded="lg" variant="elevated"
                   min-height="32"
                   height="32" class="my-2 mx-2"
                   @click="handleSelectedUser(u)">

        <v-list-item-title v-text="u.username"></v-list-item-title>

      </v-list-item>

    </v-list>

  </v-card>


  <v-snackbar
      v-model="snackbarError"
      multi-line
      color="error"
  >

    <div class="text-subtitle-1 pb-2">
      Une erreur est survenu :
    </div>
    <p>{{ errorText }}</p>

    <template v-slot:actions>
      <v-btn
          color="white"
          variant="text"
          @click="snackbarError = false"
      >
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.whiteText {
  color: white;
}
</style>