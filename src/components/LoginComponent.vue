<script setup>
import {login, logout, register} from '@/services/loginService';
import {computed, onBeforeMount, ref} from 'vue';
import logo from '@/assets/img/logo.png';
import {useRouter} from "vue-router";
import {previousRoute} from "@/router/index.js";
import ErrorInfo from "@/components/snackbars/ErrorInfo.vue";
import LogoutInfo from "@/components/snackbars/LogoutInfo.vue";
import {useDisplay} from "vuetify";
import NavbarComponent from "@/components/NavbarComponent.vue";

const router = useRouter();

const username = ref('');
const password = ref('');
const restaurantName = ref('');

const showLogin = ref(true);
const valid = ref(false);
const visible = ref(false);
const snackbar = ref(false);
const snackbarLogout = ref(false);
const errorText = ref("");

const {xs, sm, md, lg, xl} = useDisplay();

const isMobile = computed(() => xs.value || sm.value);
const isTablet = computed(() => md.value);
const isDesktop = computed(() => lg.value || xl.value);

onBeforeMount(() => {
  logout();
  if (previousRoute !== null) snackbarLogout.value = previousRoute.value.name === 'dashboard';
})

const handleLoginSubmit = async () => {
  if (valid.value) {
    try {
      const response = await login(username.value, password.value);
      if (response.status !== 200) {
        errorText.value = response.message;
        snackbar.value = true;
      }
      await router.push("dashboard")
    } catch (e) {
      errorText.value = e.message;
      snackbar.value = true;
    }
  }
}

const handleRegisterSubmit = async () => {
  if (valid.value) {
    try {
      const response = await register(username.value, restaurantName.value, password.value);
      if (response.status !== 200) {
        errorText.value = response.message;
        snackbar.value = true;
      }
      await router.push("dashboard")
    } catch (e) {
      errorText.value = e.message;
      snackbar.value = true;
    }
  }
}

const switchView = () => {
  showLogin.value = !showLogin.value;
}
</script>

<template>
  <NavbarComponent />
  <div>
    <v-container class="d-flex justify-center">
      <v-card class="pa-4" :max-width="isMobile ? 350 : isTablet ? 450 : 600" flat>
        <v-img
            :width="isMobile ? 200 : 300"
            aspect-ratio="1/1"
            cover
            :src="logo"
            alt="Logo de La bonne Franquette"
            class="mx-auto"
        />
        <div v-if="showLogin">
          <v-card-text class="card-text-center-bold">
            Bienvenue dans la bonne Franquette.<br>
            Connectez-vous pour continuer.
          </v-card-text>
          <v-form v-model="valid" @submit.prevent="handleLoginSubmit">
            <v-text-field v-model="username" label="Nom d'utilisateur" placeholder="Entrez votre nom d'utilisateur"
                          variant="outlined"
                          :rules="[v => !!v || 'Le nom d\'utilisateur est nécessaire']" required
                          rounded="xl"
                          density="compact"
                          class="input-spacing"
                          color="primary"></v-text-field>
            <v-text-field v-model="password" label="Mot de passe" placeholder="Entrez votre mot de passe"
                          variant="outlined"
                          :rules="[v => !!v || 'Le mot de passe est nécessaire']"
                          required rounded="xl"
                          :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                          :type="visible ? 'text' : 'password'"
                          @click:append-inner="visible = !visible"
                          density="compact"
                          class="input-spacing"
                          color="primary"></v-text-field>
            <v-btn variant="text" density="compact" :ripple="false" color="primary" class="mt-4 text-underline"
                   @click="switchView">
              <span :class="{'underline': true, 'text-xs': isMobile, 'text-md': isDesktop || isTablet}">
                Vous n’avez pas de restaurant ? Créez-le !
              </span>
            </v-btn>
            <br>
            <div class="d-flex justify-center">
              <v-btn type="submit" color="primary" class="mt-8" rounded="xl" :size="isMobile ? 'default' : 'large'">
                <div class="justify-start font-semibold">Se connecter</div>
              </v-btn>
            </div>
          </v-form>
        </div>
        <div v-else>
          <v-card-text class="card-text-center-bold">
            Bienvenue dans la bonne Franquette.<br>
            Créer un restaurant pour continuer.
          </v-card-text>
          <v-form v-model="valid" @submit.prevent="handleRegisterSubmit">
            <v-text-field v-model="restaurantName" label="Nom du restaurant" placeholder="Entrez le nom du restaurant"
                          variant="outlined"
                          :rules="[v => !!v || 'Le nom du restaurant est nécessaire']" required
                          rounded="xl"
                          density="compact"
                          class="input-spacing"
                          color="primary"></v-text-field>
            <v-text-field v-model="username" label="Nom du responsable" placeholder="Entrez le nom du responsable"
                          variant="outlined"
                          :rules="[v => !!v || 'Le nom du responsable est nécessaire']" required
                          rounded="xl"
                          density="compact"
                          class="input-spacing"
                          color="primary"></v-text-field>
            <v-text-field v-model="password" label="Mot de passe" placeholder="Entrez votre mot de passe"
                          variant="outlined"
                          :rules="[v => !!v || 'Le mot de passe est nécessaire', v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v) || 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre']"
                          required rounded="xl"
                          :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                          :type="visible ? 'text' : 'password'"
                          @click:append-inner="visible = !visible"
                          density="compact"
                          class="input-spacing"
                          color="primary"></v-text-field>
            <v-text-field label="Retaper votre mot de passe" placeholder="Retaper votre mot de passe" variant="outlined"
                          :rules="[v => (v === password) || 'Les mots de passe sont différents']"
                          required rounded="xl"
                          :append-inner-icon="!visible ? 'mdi-eye-off' : 'mdi-eye'"
                          :type="visible ? 'text' : 'password'"
                          @click:append-inner="visible = !visible"
                          density="compact"
                          class="input-spacing"
                          color="primary"></v-text-field>
            <v-btn variant="text" density="compact" :ripple="false" color="primary" class="mt-4 text-underline"
                   @click="switchView">
              <span :class="{'underline': true, 'text-xs': isMobile, 'text-md': isDesktop || isTablet}"> Vous avez déjà un compte ? Connectez-vous ! </span>
            </v-btn>
            <br>
            <div class="d-flex justify-center">
              <v-btn type="submit" color="primary" class="mt-8" rounded="xl" :size="isMobile ? 'default' : 'large'">
                <div class="justify-start font-semibold">Créer le restaurant</div>
              </v-btn>
            </div>
          </v-form>
        </div>
      </v-card>
    </v-container>
  </div>

  <ErrorInfo :text="errorText" :enable="snackbar" @onClose="(v) => snackbar = v"/>

  <LogoutInfo :enable="snackbarLogout" @onClose="(v) => snackbarLogout = v"/>
</template>

<style scoped>
.input-spacing {
  margin-bottom: 8px;
}

.card-text-center-bold {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  font-size: larger;
}
</style>