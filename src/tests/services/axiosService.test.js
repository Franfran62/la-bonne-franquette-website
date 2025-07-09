import { describe, it, expect, vi, beforeEach } from "vitest";
import * as axiosService from "../../services/axiosService";
import axiosInstance from "@/middlewares/axiosConfig.js";

vi.mock("@/middlewares/axiosConfig.js", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("axiosService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("fetch", () => {
        it("should call axiosInstance.get with correct endpoint", async () => {
            axiosInstance.get.mockResolvedValue({ data: "test" });
            const result = await axiosService.fetch("test-endpoint");
            expect(axiosInstance.get).toHaveBeenCalledWith("/test-endpoint");
            expect(result).toEqual({ data: "test" });
        });

        it("should throw error if axiosInstance.get fails", async () => {
            axiosInstance.get.mockRejectedValue("error");
            await expect(axiosService.fetch("fail")).rejects.toThrow();
        });
    });

    describe("post", () => {
        it("should call axiosInstance.post with correct endpoint and payload", async () => {
            axiosInstance.post.mockResolvedValue({ data: "posted" });
            const payload = { foo: "bar" };
            const result = await axiosService.post("post-endpoint", payload);
            expect(axiosInstance.post).toHaveBeenCalledWith(
                "/post-endpoint",
                payload
            );
            expect(result).toEqual({ data: "posted" });
        });

        it("should throw error if axiosInstance.post fails", async () => {
            axiosInstance.post.mockRejectedValue("error");
            await expect(axiosService.post("fail", {})).rejects.toThrow();
        });
    });

    describe("put", () => {
        it("should call axiosInstance.put with correct endpoint and payload", async () => {
            axiosInstance.put.mockResolvedValue({ data: "updated" });
            const payload = { foo: "baz" };
            const result = await axiosService.put("put-endpoint", payload);
            expect(axiosInstance.put).toHaveBeenCalledWith(
                "/put-endpoint",
                payload
            );
            expect(result).toEqual({ data: "updated" });
        });

        it("should throw error if axiosInstance.put fails", async () => {
            axiosInstance.put.mockRejectedValue("error");
            await expect(axiosService.put("fail", {})).rejects.toThrow();
        });
    });

    describe("remove", () => {
        it("should call axiosInstance.delete with correct endpoint and id", async () => {
            axiosInstance.delete.mockResolvedValue({ data: "deleted" });
            const result = await axiosService.remove("delete-endpoint", 123);
            expect(axiosInstance.delete).toHaveBeenCalledWith(
                "delete-endpoint/123"
            );
            expect(result).toEqual({ data: "deleted" });
        });

        it("should throw error if axiosInstance.delete fails", async () => {
            axiosInstance.delete.mockRejectedValue("error");
            await expect(axiosService.remove("fail", 1)).rejects.toThrow();
        });
    });
});
