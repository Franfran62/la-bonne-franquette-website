<script setup>
import {createUser, deleteUser, fetchUsers, updateUser} from "@/services/userService.js";
import {computed, onBeforeMount, ref, watch} from "vue";
import User from "@/model/User.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import SuccessInfo from "@/components/snackbars/SuccessInfo.vue";
import HintInfo from "@/components/snackbars/HintInfo.vue";
import AlertDeleteUserDialog from "@/components/dialogs/AlertDeleteUserDialog.vue";

const snackbarError = ref(false);
const snackbarSuccess = ref(false);
const snackbarInfo = ref(false);
const errorText = ref("");
const succesText = ref("");
const infoText = ref("");
const deleteConfirmDialog = ref(false);
const valid = ref(false);
const visible = ref(false);
const username = ref("");
const password = ref("");
const passwordTest = ref("");
const oldPassword = ref("");
const newRole = ref("");
const users = ref([]);
const selectedUser = ref(null);
const selectedRole = ref(null);
const formTitle = ref("Ajouter un nouveau membre");
const buttonTitle = ref("Ajouter");

const availableRoles = [
  {value: "ROLE_USER", name: "Utilisateur"},
  {value: "ROLE_MANAGER", name: "Manager"},
  {value: "ROLE_ADMIN", name: "Administrateur"},
];

onBeforeMount(() => refreshUsers());

watch(selectedUser, (newValue) => {
  if (!newValue) clearCurrentUser();
});

const filterByRole = computed(() => {
  if (!selectedRole.value) return users.value;
  return users.value.filter(user => user.roles.includes(selectedRole.value));
});

const handleSelectedUser = (user) => {
  if (selectedUser.value?.id === user.id) {
    selectedUser.value = null;
  } else {
    selectedUser.value = user;
    formTitle.value = "Modifier un utilisateur";
    buttonTitle.value = "Modifier";
    username.value = user.username;
    password.value = user.password;
    oldPassword.value = "";
    newRole.value = user.roles;
  }
};

const refreshUsers = async () => {
  try {
    const response = await fetchUsers();
    if (response.status !== 200) throw new Error(response.message);
    users.value = response.data.map(user => new User(user.id, user.username, user.restaurantId, user.roles));
    selectedUser.value = null;
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }
};

const handleSubmit = async () => {
  if (!valid.value) return;
  try {
    const response = selectedUser.value
        ? await updateUser(username.value, password.value, newRole.value, selectedUser.value.username, oldPassword.value)
        : await createUser(username.value, password.value, newRole.value);
    if (response.status !== 200) throw new Error(response.message);
    succesText.value = selectedUser.value ? "L'utilisateur a été modifié." : "L'utilisateur a été créé.";
    snackbarSuccess.value = true;
    await refreshUsers();
    if (selectedUser.value) clearCurrentUser();
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  }
};

const updateDelete = async (result) => {
  if (!result) return (deleteConfirmDialog.value = false);
  try {
    const response = await deleteUser(selectedUser.value.username);
    if (response.status !== 200) throw new Error(response.message);
    succesText.value = `L'utilisateur ${selectedUser.value.username} à été supprimé.`;
    snackbarSuccess.value = true;
    await refreshUsers();
    clearCurrentUser();
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
  } finally {
    deleteConfirmDialog.value = false;
  }
};

const handleDeleteSubmit = () => {
  if (!selectedUser.value) {
    infoText.value = "Sélectionner un utilisateur pour le supprimer.";
    snackbarInfo.value = true;
    return;
  }
  if (selectedUser.value.roles.includes("ROLE_ADMIN") && users.value.filter(user => user.roles.includes("ROLE_ADMIN")).length <= 1) {
    infoText.value = "Vous devez avoir au moins 1 administrateur dans le restaurant.";
    snackbarInfo.value = true;
    return;
  }
  deleteConfirmDialog.value = true;
};

const clearCurrentUser = () => {
  formTitle.value = "Ajouter un nouveau membre";
  buttonTitle.value = "Ajouter";
  username.value = "";
  password.value = "";
  passwordTest.value = "";
  oldPassword.value = "";
  newRole.value = "";
  selectedUser.value = null;
};
</script>

<template>
  <div class="flex justify-center mt-16">
    <v-card min-width="700" variant="text" class="px-8">
      <v-card-title>Gestion des membres de l'équipe</v-card-title>
      <v-card-actions class="flex justify-start">
        <v-btn base-color="success" rounded="xl" variant="elevated" class="pr-4" prepend-icon="mdi-plus"
               @click="clearCurrentUser">
          <span class="whiteText">Ajouter un membre</span>
        </v-btn>
        <span class="ml-16">Trier par role : </span>
        <v-select label="Role" :items="availableRoles" v-model="selectedRole" item-title="name" item-value="value"
                  clearable variant="outlined" density="compact" color="accent" rounded="xl" width="225"
                  class="mt-6"/>
        <v-btn @click="refreshUsers" icon="mdi-refresh" variant="text"></v-btn>
      </v-card-actions>
      <v-list>
        <v-list-item v-for="(u, i) in filterByRole" :key="i" color="primary" base-color="primary" rounded="lg"
                     variant="elevated" min-height="32" height="32" class="my-2 mx-2" @click="handleSelectedUser(u)">
          <v-list-item-title>{{ u.username }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>

    <v-card min-width="700" variant="text" class="px-8">
      <v-card-title>{{ formTitle }}</v-card-title>
      <v-card-actions class="flex justify-start">
        <v-btn base-color="delete" rounded="xl" variant="elevated" prepend-icon="mdi-delete" class="pr-4 mt-6"
               @click="handleDeleteSubmit">
          <span class="whiteText">Supprimer</span>
        </v-btn>
      </v-card-actions>
      <v-form v-model="valid" class="my-10 mx-2" validate-on="invalid-input" @submit.prevent="handleSubmit">
        <v-select label="Role" :items="availableRoles" v-model="newRole" item-title="name" item-value="value"
                  variant="outlined" density="compact" color="accent" :rules="[v => !!v || 'le role est nécessaire']"
                  rounded="xl" class="input-spacing"/>
        <v-text-field v-model="username" label="Nom d'utilisateur" placeholder="Entrez le nouveau nom d'utilisateur"
                      variant="outlined" :rules="[v => !!v || 'Le nom d\'utilisateur est nécessaire']" required
                      rounded="xl" density="compact" class="input-spacing" color="accent"/>
        <span v-if="selectedUser && selectedUser.value !== null">
          <v-text-field v-model="oldPassword" label="Ancient mot de passe"
                        placeholder="Entrez l'ancient mot de passe" variant="outlined"
                        :rules="[v => !!v || 'Le mot de passe est nécessaire']" required
                        rounded="xl" density="compact" class="input-spacing" color="accent"
                        :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'"
                        @click:append-inner="visible = !visible"/>
          <v-text-field v-model="password" label="Nouveau mot de passe"
                        placeholder="Entrez le nouveau mot de passe" variant="outlined"
                        :rules="[v => !!v || 'Le mot de passe est nécessaire', v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v) || 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre']"
                        required rounded="xl" density="compact" class="input-spacing"
                        color="accent" :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'"
                        @click:append-inner="visible = !visible"/>
        </span>
        <span v-else>
          <v-text-field v-model="password" label="Mot de passe"
                        placeholder="Entrez le mot de passe" variant="outlined"
                        :rules="[v => !!v || 'Le mot de passe est nécessaire', v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v) || 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre']"
                        required rounded="xl" density="compact" class="input-spacing"
                        color="accent" :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'"
                        @click:append-inner="visible = !visible"/>
          <v-text-field v-model="passwordTest" label="Retaper votre mot de passe"
                        placeholder="Retaper votre mot de passe" variant="outlined"
                        :rules="[v => (v === password) || 'Les mots de passe sont différents']"
                        required rounded="xl"
                        :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'"
                        @click:append-inner="visible = !visible" density="compact"
                        class="input-spacing" color="accent"/>
        </span>
        <div class="d-flex justify-center pb-8">
          <v-btn type="submit" color="primary" rounded="xl" size="large">
            <div class="justify-start font-semibold">{{ buttonTitle }}</div>
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>

  <ErrorInfo :text="errorText" :enable="snackbarError" @onClose="(v) => snackbarError = v"/>
  <SuccessInfo :text="succesText" :enable="snackbarSuccess" @onClose="(v) => snackbarSuccess = v"/>
  <HintInfo :text="infoText" :enable="snackbarInfo" @onClose="(v) => snackbarInfo = v"/>
  <AlertDeleteUserDialog :username="selectedUser?.value?.username" :enable="deleteConfirmDialog"
                         @result="updateDelete"/>
</template>

<style scoped>
.whiteText {
  color: white;
}

.input-spacing {
  margin-bottom: 8px;
}
</style>