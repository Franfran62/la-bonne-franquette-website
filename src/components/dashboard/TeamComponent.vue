<script setup>
import {createUser, deleteUser, fetchUsers, updateUser} from "@/services/userService.js";
import {computed, onBeforeMount, ref, watch} from "vue";
import User from "@/model/User.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import SuccessInfo from "@/components/snackbars/SuccessInfo.vue";
import HintInfo from "@/components/snackbars/HintInfo.vue";
import AlertDeleteUserDialog from "@/components/dialogs/AlertDeleteUserDialog.vue";
import {useDisplay} from "vuetify";

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
const {xs, sm, md, lg, xl} = useDisplay();

const isMobile = computed(() => xs.value || sm.value);
const isTablet = computed(() => md.value);
const isDesktop = computed(() => lg.value || xl.value);

const availableRoles = [
  {value: "ROLE_USER", name: "Utilisateur"},
  {value: "ROLE_MANAGER", name: "Manager"},
  {value: "ROLE_ADMIN", name: "Administrateur"},
];

onBeforeMount(() => refreshUsers());

watch(selectedUser, (newValue) => {
  console.log("new user", newValue);
  if (!newValue) clearCurrentUser();
});

const filterByRole = computed(() => {
  if (!selectedRole.value) return users.value;
  return users.value.filter(user => user.roles.includes(selectedRole.value));
});

const handleSelectedUser = (user) => {
  selectedUser.value = user;
  formTitle.value = "Modifier un utilisateur";
  buttonTitle.value = "Modifier";
  username.value = user.username;
  password.value = user.password;
  oldPassword.value = "";
  newRole.value = user.roles;

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
  if (!result) {
    selectedUser.value = null;
    return (deleteConfirmDialog.value = false);
  }
  try {
    const response = await deleteUser(selectedUser.value.username);
    if (response.status !== 200) throw new Error(response.message);
    succesText.value = `L'utilisateur ${selectedUser.value.username} à été supprimé.`;
    snackbarSuccess.value = true;
    selectedUser.value = null;
    await refreshUsers();
  } catch (e) {
    errorText.value = e.message;
    snackbarError.value = true;
    selectedUser.value = null;
  } finally {
    deleteConfirmDialog.value = false;
    selectedUser.value = null;
  }
};

const handleDeleteSubmit = async (userToDelete) => {
  if (!userToDelete) {
    infoText.value = "Sélectionner un utilisateur pour le supprimer.";
    snackbarInfo.value = true;
    return;
  }
  if (userToDelete.roles.includes("ROLE_ADMIN") && users.value.filter(user => user.roles.includes("ROLE_ADMIN")).length <= 1) {
    selectedUser.value = null;
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
  <v-card variant="text" class="flex justify-center mx-auto">
    <v-card-title>Gestion des membres de l'équipe</v-card-title>
  </v-card>
  <div :class="{'flex flex-column-reverse': isMobile, 'flex justify-center': !isMobile}">
    <v-card :width="isMobile ? 400 : 700" variant="text" :class="{'mx-auto': isMobile }">
      <v-card-title v-show="!isMobile">Membres de l'équipe</v-card-title>
      <div>
        <v-card-actions :class="{'flex justify-start': !isMobile}">
          <v-btn base-color="success" rounded="xl" variant="elevated" class="pr-4" prepend-icon="mdi-plus"
                 @click="clearCurrentUser" v-show="!isMobile">
            <span class="whiteText">Ajouter un membre</span>
          </v-btn>
          <span class="ml-14" v-show="!isMobile">Trier par role : </span>
          <v-select label="Role" :items="availableRoles" v-model="selectedRole" item-title="name" item-value="value"
                    clearable variant="outlined" density="compact" color="accent" rounded="xl"
                    :width="!isMobile ? 225: 25"
                    class="mt-6"/>
          <v-btn @click="clearCurrentUser" icon="mdi-plus" variant="text" base-color="success" rounded="xl"
                 v-show="isMobile"></v-btn>
          <v-btn @click="refreshUsers" icon="mdi-refresh" variant="text"></v-btn>
        </v-card-actions>
        <v-list>
          <v-list-item v-for="(u, i) in filterByRole" :key="i" color="primary" base-color="primary" rounded="lg"
                       variant="elevated" min-height="32" height="32" class="flex justify-space-around my-2 mx-2" @click="handleSelectedUser(u)">
            <v-list-item-title class="flex justify-space-between">
              {{ u.username }}
               <v-icon color="white" variant="text" icon="mdi-delete" @click="handleDeleteSubmit(u)"/>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-card>

    <v-card :width="isMobile ? 400 : 700" variant="text" :class="{'px-8': !isMobile, 'px-8 mx-auto': isMobile }">
      <v-card-title>{{ formTitle }}</v-card-title>
      <v-form v-model="valid" :class="{'my-9 mx-2': !isMobile, 'my-2 mx-2': isMobile}" validate-on="invalid-input"
              @submit.prevent="handleSubmit">
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
        <div :class="{'d-flex justify-center pb-8': !isMobile, 'd-flex justify-center': isMobile}">
          <v-btn type="submit" color="primary" rounded="xl" :size="isMobile ? 'default' : 'large'">
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