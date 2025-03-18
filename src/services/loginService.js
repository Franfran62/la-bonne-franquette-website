import axiosInstance from "@/middlewares/axiosConfig";
import { useAuthTokenStore, useRefreshTokenStore } from "@/stores/authToken";

const apiURL = import.meta.env.VITE_API_URL;

console.log(apiURL);

const _login = (username, password) => {
  return axiosInstance.post(`/auth/login`, {
    username: username,
    password: password,
  });
};

/**
 *
 * Lance une requête POST à l'api afin de connecter l'utilisateur
 * et enregistre les tokens d'authentification et de refresh dans leur store respectif.
 *
 * @param username Nom d'utilisateur
 * @param password Mot de passe de l'utilisateur
 * @returns {Promise<number>} Code HTTP de la réponse
 *
 */
const login = async (username, password) => {
  try {
    const response = await _login(username, password);
    const authTokenStore = useAuthTokenStore();
    const refreshTokenStore = useRefreshTokenStore();
    authTokenStore.token = response.data["accessToken"];
    refreshTokenStore.token = response.data["refreshToken"];
    return response.status;
  } catch (error) {
    console.error("Erreur de connexion: ", error);
  }
};

export { login };
