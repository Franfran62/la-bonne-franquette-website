import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as loginService from "../../services/loginService";
import * as axiosService from "@/services/axiosService.js";
import * as authTokenStoreModule from "@/stores/authToken";

describe("loginService", () => {
    let mockAuthTokenStore, mockRefreshTokenStore;

    beforeEach(() => {
        // Mock the stores
        mockAuthTokenStore = { token: "", $reset: vi.fn() };
        mockRefreshTokenStore = { token: "", $reset: vi.fn() };
        vi.spyOn(authTokenStoreModule, "useAuthTokenStore").mockReturnValue(
            mockAuthTokenStore
        );
        vi.spyOn(authTokenStoreModule, "useRefreshTokenStore").mockReturnValue(
            mockRefreshTokenStore
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("login", () => {
        it("should set tokens and return response on successful login", async () => {
            const mockResponse = {
                data: { accessToken: "access", refreshToken: "refresh" },
                status: 200,
            };
            vi.spyOn(axiosService, "post").mockResolvedValue(mockResponse);

            const result = await loginService.login("user", "pass");

            expect(axiosService.post).toHaveBeenCalledWith("auth/login", {
                username: "user",
                password: "pass",
            });
            expect(mockAuthTokenStore.token).toBe("access");
            expect(mockRefreshTokenStore.token).toBe("refresh");
            expect(result).toBe(mockResponse);
        });

        it("should throw an error if login fails", async () => {
            vi.spyOn(axiosService, "post").mockRejectedValue("fail");
            await expect(loginService.login("user", "pass")).rejects.toThrow(
                "fail"
            );
        });
    });

    describe("register", () => {
        it("should call login after successful registration", async () => {
            const registerResponse = { status: 200, data: {} };
            const loginResponse = {
                data: { accessToken: "a", refreshToken: "r" },
                status: 200,
            };
            vi.spyOn(axiosService, "post")
                .mockResolvedValueOnce(registerResponse) // for register
                .mockResolvedValueOnce(loginResponse); // for login

            const result = await loginService.register("user", "resto", "pass");

            expect(axiosService.post).toHaveBeenNthCalledWith(
                1,
                "restaurant/create",
                {
                    username: "user",
                    password: "pass",
                    restaurantName: "resto",
                }
            );
            expect(result).toEqual(loginResponse);
        });

        it("should return error object if registration fails with non-200 status", async () => {
            const registerResponse = {
                status: 400,
                data: { Erreur: "Username exists" },
            };
            vi.spyOn(axiosService, "post").mockResolvedValue(registerResponse);

            const result = await loginService.register("user", "resto", "pass");
            expect(result).toEqual({ status: 400, message: "Username exists" });
        });

        it("should throw an error if registration throws", async () => {
            vi.spyOn(axiosService, "post").mockRejectedValue("fail");
            await expect(
                loginService.register("user", "resto", "pass")
            ).rejects.toThrow("fail");
        });
    });

    describe("logout", () => {
        it("should reset both auth and refresh token stores", () => {
            loginService.logout();
            expect(mockAuthTokenStore.$reset).toHaveBeenCalled();
            expect(mockRefreshTokenStore.$reset).toHaveBeenCalled();
        });
    });
});
