import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import axiosInstance from "@/middlewares/axiosConfig";
import * as authTokenStore from "@/stores/authToken";
import router from "@/router";
import * as axiosService from "@/services/axiosService";

vi.mock("@/stores/authToken", () => ({
    useAuthTokenStore: vi.fn(),
    useRefreshTokenStore: vi.fn(),
}));
vi.mock("@/router", () => ({
    default: { push: vi.fn() },
}));
vi.mock("@/services/axiosService", () => ({
    post: vi.fn(),
}));

describe("axiosConfig", () => {
    let mock;
    let authToken;
    let refreshToken;

    beforeEach(() => {
        mock = new MockAdapter(axiosInstance);
        authToken = { token: "access-token" };
        refreshToken = { token: "refresh-token" };
        authTokenStore.useAuthTokenStore.mockReturnValue(authToken);
        authTokenStore.useRefreshTokenStore.mockReturnValue(refreshToken);
        router.push.mockClear();
    });

    afterEach(() => {
        mock.reset();
        vi.clearAllMocks();
    });

    it("should add Auth-Token and Refresh-Token headers on request", async () => {
        mock.onGet("/test").reply((config) => {
            expect(config.headers["Auth-Token"]).toBe("access-token");
            expect(config.headers["Refresh-Token"]).toBe("refresh-token");
            return [200, { success: true }];
        });
        const res = await axiosInstance.get("/test");
        expect(res.data.success).toBe(true);
    });

    it("should not add Auth-Token header for auth/refresh endpoint", async () => {
        mock.onPost("/auth/refresh").reply((config) => {
            expect(config.headers["Auth-Token"]).toBeUndefined();
            expect(config.headers["Refresh-Token"]).toBe("refresh-token");
            return [200, { accessToken: "new-access-token" }];
        });
        await axiosInstance.post("/auth/refresh");
    });

    it("should refresh token and retry original request on 401", async () => {
        // First call returns 401, triggers refresh
        mock.onGet("/protected").replyOnce(401);
        // Refresh endpoint returns new access token
        axiosService.post.mockResolvedValue({
            data: { accessToken: "new-access-token" },
        });
        // Second call with new token succeeds
        mock.onGet("/protected").reply((config) => {
            expect(config.headers["Auth-Token"]).toBe("new-access-token");
            return [200, { ok: true }];
        });

        authTokenStore.useAuthTokenStore.mockReturnValue({
            token: "",
            set token(val) {
                this._token = val;
            },
            get token() {
                return this._token;
            },
            _token: "",
        });

        const res = await axiosInstance.get("/protected");
        expect(res.data.ok).toBe(true);
        expect(axiosService.post).toHaveBeenCalledWith("auth/refresh", {
            refreshToken: "refresh-token",
        });
    });

    it("should clear tokens and redirect on refresh failure", async () => {
        mock.onGet("/protected").replyOnce(401);
        axiosService.post.mockRejectedValue(new Error("refresh failed"));

        const authTokenMock = { token: "access-token" };
        const refreshTokenMock = { token: "refresh-token" };
        authTokenStore.useAuthTokenStore.mockReturnValue(authTokenMock);
        authTokenStore.useRefreshTokenStore.mockReturnValue(refreshTokenMock);

        await expect(axiosInstance.get("/protected")).rejects.toThrow("refresh failed");
        expect(authTokenMock.token).toBe("");
        expect(refreshTokenMock.token).toBe("");
        expect(router.push).toHaveBeenCalledWith({ name: "connexion" });
    });

    it("should handle 599 error", async () => {
        mock.onGet("/test").reply(599);
        await expect(axiosInstance.get("/test")).rejects.toBe(
            "Impossible de contacter le serveur, réessayez plus tard."
        );
    });

    it("should handle 500+ errors", async () => {
        mock.onGet("/test").reply(500);
        await expect(axiosInstance.get("/test")).rejects.toBe(
            "Oups, une erreur est survenue, réessayez plus tard."
        );
    });

    it("should handle custom error message from response", async () => {
        mock.onGet("/test").reply(400, { Erreur: "Custom error" });
        await expect(axiosInstance.get("/test")).rejects.toBe("Custom error");
    });

    it("should handle generic error message", async () => {
        mock.onGet("/test").networkError();
        await expect(axiosInstance.get("/test")).rejects.toBeDefined();
    });
});