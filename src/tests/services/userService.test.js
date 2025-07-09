import { describe, it, expect, vi, beforeEach } from "vitest";
import * as axiosService from "@/services/axiosService.js";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/services/userService";

vi.mock("@/services/axiosService.js", () => ({
    fetch: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    remove: vi.fn(),
}));

describe("userService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("fetchUsers", () => {
        it("should call fetch with 'user' and return result", async () => {
            axiosService.fetch.mockResolvedValueOnce([{ username: "john" }]);
            const result = await fetchUsers();
            expect(axiosService.fetch).toHaveBeenCalledWith("user");
            expect(result).toEqual([{ username: "john" }]);
        });

        it("should throw error if fetch fails", async () => {
            axiosService.fetch.mockImplementationOnce(() => {
                throw "error";
            });
            await expect(fetchUsers()).rejects.toThrow("error");
        });
    });

    describe("createUser", () => {
        it("should call post with correct params and return result", async () => {
            axiosService.post.mockResolvedValueOnce({ success: true });
            const result = await createUser("alice", "pass", "admin");
            expect(axiosService.post).toHaveBeenCalledWith("user", {
                username: "alice",
                password: "pass",
                role: "admin",
            });
            expect(result).toEqual({ success: true });
        });

        it("should throw error if post fails", async () => {
            axiosService.post.mockRejectedValueOnce("fail");
            await expect(createUser("bob", "pw", "user")).rejects.toThrow(
                "fail"
            );
        });
    });

    describe("updateUser", () => {
        it("should call put with correct params and return result", async () => {
            axiosService.put.mockResolvedValueOnce({ updated: true });
            const result = await updateUser(
                "alice",
                "pw",
                "admin",
                "oldAlice",
                "oldPw"
            );
            expect(axiosService.put).toHaveBeenCalledWith("user", {
                username: "alice",
                password: "pw",
                role: "admin",
                oldUsername: "oldAlice",
                oldPassword: "oldPw",
            });
            expect(result).toEqual({ updated: true });
        });

        it("should throw error if put fails", async () => {
            axiosService.put.mockRejectedValueOnce("fail");
            await expect(
                updateUser("alice", "pw", "admin", "oldAlice", "oldPw")
            ).rejects.toThrow("fail");
        });
    });

    describe("deleteUser", () => {
        it("should call remove with correct params and return result", async () => {
            axiosService.remove.mockResolvedValueOnce({ deleted: true });
            const result = await deleteUser("alice");
            expect(axiosService.remove).toHaveBeenCalledWith("user", "alice");
            expect(result).toEqual({ deleted: true });
        });

        it("should throw error if remove fails", async () => {
            axiosService.remove.mockRejectedValueOnce("fail");
            await expect(deleteUser("alice")).rejects.toThrow("fail");
        });
    });
});
