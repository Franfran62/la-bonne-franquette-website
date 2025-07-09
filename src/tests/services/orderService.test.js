import { describe, it, expect, vi } from "vitest";
import { fetchOrders } from "@/services/orderService";
import * as axiosService from "@/services/axiosService";

describe("fetchOrders", () => {
    it("should return data when fetch succeeds", async () => {
        const mockData = [{ id: 1, name: "Order 1" }];
        vi.spyOn(axiosService, "fetch").mockResolvedValue(mockData);

        const result = await fetchOrders();
        expect(result).toBe(mockData);
        expect(axiosService.fetch).toHaveBeenCalledWith("order");
    });

    it("should throw an error when fetch fails", async () => {
        const mockError = new Error('Network error');
        vi.spyOn(axiosService, "fetch").mockRejectedValue(mockError);

        await expect(fetchOrders()).rejects.toThrow(mockError);
        expect(axiosService.fetch).toHaveBeenCalledWith("order");
    });
});
