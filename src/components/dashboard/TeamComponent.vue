<script setup>
import {createUser, deleteUser, fetchUsers, updateUser} from "@/services/userService.js";
import {computed, onBeforeMount, ref, watch} from "vue";
import User from "@/model/User.js";

const snackbarError = ref(false);
const snackbarSuccess = ref(false)
const snackbarInfo = ref(false)
const errorText = ref("");
const succesText = ref("");
const infoText = ref("");

const deleteConfirmDialog = ref(false);
const deleteChoice = ref(null);

const valid = ref(false);

const visible = ref(false);
const username = ref("")
const password = ref("")
const oldPassword = ref("")
const newRole = ref("")

const users = ref([]);
const selectedUser = ref(null)

const selectedRole = ref(null)
const availableRoles = [
  {value: "ROLE_USER", name: "Utilisateur"},
  {value: "ROLE_MANAGER", name: "Manager"},
  {value: "ROLE_ADMIN", name: "Administrateur"},
]

const formTitle = ref("Ajouter un nouveau membre")
const buttonTitle = ref("Ajouter")

onBeforeMount(() => {
  refreshUsers();
})

watch(selectedUser, (newValue) => {
  if (newValue === null) {
    clearCurrentUser();
  }
});

const filterByRole = computed(() => {
  if (selectedRole.value === null || selectedRole.value === "") return users.value;
  return users.value.filter(user => user.roles.split(',').includes(selectedRole.value));
});

const handleSelectedUser = (user) => {
  if (selectedUser.value && selectedUser.value.id === user.id) {
    selectedUser.value = null;
  } else {
    selectedUser.value = user;
    formTitle.value = "Modifier un utilisateur"
    buttonTitle.value = "Modifier"
    username.value = selectedUser.value["username"];
    password.value = selectedUser.value["password"];
    oldPassword.value = "";
    newRole.value = selectedUser.value["roles"];
  }
}

const refreshUsers = async () => {
  try {
    const response = await fetchUsers();
    if (response.status !== 200) {
      errorText.value = response.message;
      snackbarError.value = true;
      return;
    }
    users.value = [];
    selectedUser.value = null;
    response.data.forEach(user => {
      users.value.push(new User(user.id, user.username, user.restaurantId, user.roles));
    });
  } catch (e) {
    console.log(e)
    errorText.value = e.message;
    snackbarError.value = true;
  }
}

const handleSubmit = async () => {
  if (valid.value) {
    try {
      if (selectedUser.value === null) {
        const response = await createUser(username.value, password.value, newRole.value);
        if (response.status !== 200) {
          console.log(response)
          errorText.value = response.message;
          snackbarError.value = true;
        } else {
          succesText.value = "L'utilisateur à été créé."
          snackbarSuccess.value = true;
          await refreshUsers();
        }
      } else {
        const response = await updateUser(username.value, password.value, newRole.value, selectedUser.value.username, oldPassword.value);
        if (response.status !== 200) {
          errorText.value = response.message;
          snackbarError.value = true;
        } else {
          succesText.value = "L'utilisateur à été modifié."
          snackbarSuccess.value = true;
          await refreshUsers();
          clearCurrentUser();
        }
      }
    } catch (e) {
      errorText.value = e.message;
      snackbarError.value = true;
    }
  }
}

const cancelDelete = () => {
  deleteConfirmDialog.value = false;
  deleteChoice.value = false;
};

const confirmDelete = () => {
  deleteConfirmDialog.value = false;
  deleteChoice.value = true;
};

const handleDelete = async () => {
  try {
    if (selectedUser.value !== null) {
      if (selectedUser.value.roles.split(',').includes("ROLE_ADMIN") && users.value.filter(user => user.roles.split(',').includes("ROLE_ADMIN")).length <= 1) {
        infoText.value = "Vous devez avoir au moins 1 administrateur dans le restaurant."
        snackbarInfo.value = true;
      } else {
        if (deleteChoice.value === null) {
          deleteConfirmDialog.value = true;
          if (!deleteChoice.value) {
            deleteChoice.value = null;
            return;
          }
        }
        deleteChoice.value = null;
        const response = await deleteUser(selectedUser.value.username);
        if (response.status !== 200) {
          errorText.value = response.message;
          snackbarError.value = true;
        } else {
          succesText.value = "L'utilisateur à été supprimé."
          snackbarSuccess.value = true;
          await refreshUsers();
          clearCurrentUser();
        }
      }
    } else {
      infoText.value = "Sélectionner un utilisateur pour le supprimer."
      snackbarInfo.value = true;

    }
  } catch (error) {
    errorText.value = error.message;
    snackbarError.value = true;
  }
}

const clearCurrentUser = () => {
  formTitle.value = "Ajouter un nouveau membre";
  buttonTitle.value = "Ajouter";
  username.value = "";
  password.value = "";
  oldPassword.value = "";
  newRole.value = "";
  selectedUser.value = null;
}
</script>

<template>
  <div class="flex justify-center mt-16">
    <v-card min-width="700" variant="text" class="px-8">
      <v-card-title>
        Gestion des membres de l'équipe
      </v-card-title>
      <v-card-actions class="flex justify-start">
        <v-btn base-color="success" rounded="xl" variant="elevated" class="pr-4" prepend-icon="mdi-plus"
               @click="clearCurrentUser">
        <span class="whiteText">
          Ajouter un membre
        </span>
        </v-btn>
        <span class="ml-16">Trier par role : </span>
        <v-select label="Role" :items="availableRoles" v-model="selectedRole"
                  item-title="name" item-value="value" clearable
                  variant="outlined" density="compact"
                  color="accent"
                  rounded="xl" max-width="225" class="mt-6">
        </v-select>
        <v-btn @click="refreshUsers" icon="mdi-refresh" variant="text">
        </v-btn>
      </v-card-actions>
      <v-list >
        <v-list-item v-for="(u, i) in filterByRole" :value="u" :key="i"
                     color="primary" base-color="primary"
                     rounded="lg" variant="elevated"
                     min-height="32"
                     height="32" class="my-2 mx-2"
                     @click="handleSelectedUser(u)">
          <v-list-item-title v-text="u.username"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>

    <v-card min-width="700" variant="text" class="px-8">
      <v-card-title>
        {{ formTitle }}
      </v-card-title>
      <v-card-actions class="flex justify-start">
        <v-btn base-color="delete" rounded="xl" variant="elevated" prepend-icon="mdi-delete" class="pr-4 mt-6"
               @click="handleDelete">
          <span class="whiteText">
            Supprimer
          </span>
        </v-btn>
      </v-card-actions>
      <v-form v-model="valid" class="my-8 mx-2 px-8" validate-on="submit" @submit.prevent="handleSubmit">
        <v-select label="Role" :items="availableRoles" v-model="newRole"
                  item-title="name" item-value="value"
                  variant="outlined" density="compact"
                  color="accent" :rules="[v => !!v || 'le role est nécessaire']"
                  rounded="xl" class="input-spacing"
        >
        </v-select>
        <v-text-field v-model="username" label="Nom d'utilisateur" placeholder="Entrez le nouveau nom d'utilisateur"
                      variant="outlined"
                      :rules="[v => !!v || 'Le nom d\'utilisateur est nécessaire']" required
                      rounded="xl"
                      density="compact"
                      class="input-spacing"
                      color="accent"></v-text-field>

        <span v-if="selectedUser && selectedUser.value !== null">
           <v-text-field v-model="oldPassword" label="Ancient mot de passe" placeholder="Entrez l'ancient mot de passe"
                         variant="outlined"
                         :rules="[v => !!v || 'Le mot de passe est nécessaire']"
                         required rounded="xl"
                         density="compact"
                         class="input-spacing"
                         color="accent"
                         :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                         :type="visible ? 'text' : 'password'"
                         @click:append-inner="visible = !visible"></v-text-field>
          <v-text-field v-model="password" label="Nouveau mot de passe" placeholder="Entrez le nouveau mot de passe"
                        variant="outlined"
                        :rules="[v => !!v || 'Le mot de passe est nécessaire', v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v) || 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre']"
                        required rounded="xl"
                        density="compact"
                        class="input-spacing"
                        color="accent"
                        :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'"
                        @click:append-inner="visible = !visible"></v-text-field>
        </span>
        <span v-else>
        <v-text-field v-model="password" label="Mot de passe" placeholder="Entrez le mot de passe"
                      variant="outlined"
                      :rules="[v => !!v || 'Le mot de passe est nécessaire', v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v) || 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre']"
                      required rounded="xl"
                      density="compact"
                      class="input-spacing"
                      color="accent"
                      :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visible ? 'text' : 'password'"
                      @click:append-inner="visible = !visible"></v-text-field>
        <v-text-field label="Retaper votre mot de passe" placeholder="Retaper votre mot de passe" variant="outlined"
                      :rules="[v => (v === password) || 'Les mots de passe sont différents']"
                      required rounded="xl"
                      :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visible ? 'text' : 'password'"
                      @click:append-inner="visible = !visible"
                      density="compact"
                      class="input-spacing "
                      color="accent"></v-text-field>
      </span>

        <div class="d-flex justify-center pb-8">
          <v-btn type="submit" color="primary" rounded="xl" size="large">
            <div class="justify-start font-semibold">{{ buttonTitle }}</div>
          </v-btn>
        </div>
      </v-form>
    </v-card>

  </div>

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

  <v-snackbar
      v-model="snackbarSuccess"
      color="success"
      timeout="2500"
  >
    <div class="text-white">
      {{ succesText }}
    </div>

    <template v-slot:actions>
      <v-btn
          color="white"
          variant="text"
          @click="snackbarSuccess = false"
      >
        Fermer
      </v-btn>
    </template>
  </v-snackbar>

  <v-snackbar
      v-model="snackbarInfo"
      color="info"
      timeout="2500"
  >
    <div class="text-white">
      {{ infoText }}
    </div>

    <template v-slot:actions>
      <v-btn
          color="white"
          variant="text"
          @click="snackbarSuccess = false"
      >
        Fermer
      </v-btn>
    </template>
  </v-snackbar>

  <v-dialog
      v-model="deleteConfirmDialog"
      max-width="450"
      persistent
  >
    <v-card
        prepend-icon="mdi-alert"
        title="Vous allez supprimer un utilisateur.">
      <v-card-text>Vous êtes sur le point de supprimer l'utilisateur {{ selectedUser.username }}, êtes-vous sûr
        ?
      </v-card-text>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn @click="cancelDelete">
          Non
        </v-btn>
        <v-btn @click="confirmDelete">
          Oui
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.whiteText {
  color: white;
}

.input-spacing {
  margin-bottom: 8px;
}
</style>