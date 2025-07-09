import { describe, it, expect, vi, beforeEach } from "vitest";
import * as axiosService from "@/services/axiosService";
import { editRestaurantName, getRestauratnName } from "@/services/restaurantService";

vi.mock("@/services/axiosService");

describe("restaurantService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("editRestaurantName", () => {
        it("should call put with correct arguments and return response", async () => {
            const mockResponse = { status: 200, data: { success: true } };
            axiosService.put.mockResolvedValueOnce(mockResponse);

            const newName = "Le Gourmet";
            const result = await editRestaurantName(newName);

            expect(axiosService.put).toHaveBeenCalledWith("restaurant/rename", {
                newRestaurantName: newName,
            });
            expect(result).toBe(mockResponse);
        });

        it("should throw an error if put fails", async () => {
            const error = new Error("Network error");
            axiosService.put.mockRejectedValueOnce(error);

            await expect(editRestaurantName("Le Gourmet")).rejects.toThrow(
                error
            );
        });
    });

    describe("getRestauratnName", () => {
        it("should return restaurant name when response is 200", async () => {
            const mockResponse = { status: 200, data: { name: "Chez Toto" } };
            axiosService.fetch.mockResolvedValueOnce(mockResponse);

            const result = await getRestauratnName();

            expect(axiosService.fetch).toHaveBeenCalledWith("restaurant/name");
            expect(result).toBe("Chez Toto");
        });

        it("should throw an error if fetch fails", async () => {
            const error = new Error("Fetch failed");
            axiosService.fetch.mockRejectedValueOnce(error);

            await expect(getRestauratnName()).rejects.toThrow(error);
        });

        it("should return undefined if response status is not 200", async () => {
            const mockResponse = { status: 404, data: {} };
            axiosService.fetch.mockResolvedValueOnce(mockResponse);

            const result = await getRestauratnName();

            expect(result).toBeUndefined();
        });
    });
});
