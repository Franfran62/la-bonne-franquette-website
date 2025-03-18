import axiosInstance from "@/middlewares/axiosConfig";
import { useAuthTokenStore, useRefreshTokenStore } from "@/stores/authToken";

const apiURL = import.meta.env.VITE_API_URL;

console.log(apiURL);

const loginService = (username, password) => {
  return axiosInstance.post(`/auth/login`, {
    username: username,
    password: password,
  });
};

const login = async (username, password) => {
  try {
    const response = await loginService(username, password);
    const authTokenStore = useAuthTokenStore();
    const refreshTokenStore = useRefreshTokenStore();
    authTokenStore.token = response.data.authToken;
    refreshTokenStore.token = response.data.refreshToken;
    return response.status;
  } catch (error) {
    console.error("Erreur de connexion: ", error);
  }
};

export { login };
