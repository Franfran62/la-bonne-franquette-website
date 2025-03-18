import { defineStore } from "pinia";

export const useAuthTokenStore = defineStore("authToken", {
  state: () => ({
    token: "",
  }),
  actions: {
    clear() {
      this.token = "";
    },
  },
});

export const useRefreshTokenStore = defineStore("refreshToken", {
  state: () => ({
    token: "",
  }),
  actions: {
    clear() {
      this.token = "";
    },
  },
});
