import axiosInstance from "@/middlewares/axiosConfig";
import {useAuthTokenStore, useRefreshTokenStore} from "@/stores/authToken";

const _login = (username, password) => {
    return axiosInstance.post(`/auth/login`, {
        username: username,
        password: password,
    });
};

const _register = (username, restaurantName, password) => {
    return axiosInstance.post(`/restaurant/create`, {
        username: username,
        password: password,
        restaurantName: restaurantName,
    });
};

const logout = () => {
    const authTokenStore = useAuthTokenStore();
    const refreshTokenStore = useRefreshTokenStore();
    authTokenStore.$reset();
    refreshTokenStore.$reset();
}

/**
 * Lance une requête de connexion à l'api
 * @param username Nom de l'utilisateur
 * @param password Mot de passe de l'utilisateur
 * @returns {Promise<AxiosResponse<any>|{status: number, message}>} Réponse de l'api
 */
const login = async (username, password) => {
    try {
        const response = await _login(username, password);
        const authTokenStore = useAuthTokenStore();
        const refreshTokenStore = useRefreshTokenStore();
        authTokenStore.token = response.data["accessToken"];
        refreshTokenStore.token = response.data["refreshToken"];
        return response;
    } catch (error) {

            throw new Error(error);

    }
};

/**
 * Lance une requête de création de restaurant à l'api puis appel la méthode login pour se connecter
 * @param username Nom du responsable du nouveau restaurant
 * @param restaurantName Nom du restaurant
 * @param password Mot de passe du responsable du restaurant
 * @returns {Promise<{status: number, message}>} Réponse de l'api
 */
const register = async (username, restaurantName, password) => {
    try {
        const response = await _register(username, restaurantName, password);
        console.log(response);
        if (response.status === 200) {
            await login(username, password);
        } else {
            return {status: response.status, message: response.data["Erreur"]};
        }
    } catch (error) {
            throw new Error(error);

    }
};

export {login, register, logout};
