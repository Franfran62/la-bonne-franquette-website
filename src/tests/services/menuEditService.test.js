import { describe, it, expect, vi, beforeEach } from "vitest";
import * as menuEditService from "@/services/menuEditService";
import MenuElements from "@/model/MenuElements.js";
import Addon from "@/model/Addon.js";
import Category from "@/model/Category.js";
import SubCategory from "@/model/SubCategory.js";
import Ingredients from "@/model/Ingredients.js";
import Product from "@/model/Product.js";
import Menu from "@/model/Menu.js";
import MenuItem from "@/model/MenuItem.js";
import PaymentType from "@/model/PaymentType";
const { fetch, post, put, remove } = require("@/services/axiosService.js");
const { getEnumKeyByValue } = require("@/helpers/enumHelpers.js");

// Mock dependencies
vi.mock("@/services/axiosService.js", () => ({
    fetch: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    remove: vi.fn(),
}));
vi.mock("@/helpers/enumHelpers.js", () => ({
    getEnumKeyByValue: vi.fn((_, type) => type.toLowerCase()),
}));

describe("menuEditService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("fetchElements", () => {
        it("fetches ADDON elements and maps to Addon instances", async () => {
            fetch.mockResolvedValueOnce({
                data: [
                    { id: 1, name: "Sauce", price: 0.5, VATRate: 10 },
                    { id: 2, name: "Cheese", price: 1, VATRate: 10 },
                ],
            });
            const result = await menuEditService.fetchElements(
                MenuElements.ADDON
            );
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Addon);
            expect(result[0].name).toBe("Sauce");
        });

        it("fetches CATEGORY elements and maps to Category/SubCategory instances", async () => {
            fetch.mockResolvedValueOnce({
                data: [
                    { id: 1, name: "Pizza", categoryType: "category" },
                    {
                        id: 2,
                        name: "Vegan",
                        categoryType: "sub-category",
                        categoryId: 1,
                    },
                ],
            });
            const result = await menuEditService.fetchElements(
                MenuElements.CATEGORY
            );
            expect(result[0]).toBeInstanceOf(Category);
            expect(result[1]).toBeInstanceOf(SubCategory);
        });

        it("fetches SUBCATEGORY elements and returns only SubCategory instances", async () => {
            fetch.mockResolvedValueOnce({
                data: [
                    { id: 1, name: "Pizza", categoryType: "category" },
                    {
                        id: 2,
                        name: "Vegan",
                        categoryType: "sub-category",
                        categoryId: 1,
                    },
                ],
            });
            const result = await menuEditService.fetchElements(
                MenuElements.SUBCATEGORY
            );
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(SubCategory);
        });

        it("fetches INGREDIENT elements and maps to Ingredients instances", async () => {
            fetch.mockResolvedValueOnce({
                data: [
                    { id: 1, name: "Tomato" },
                    { id: 2, name: "Cheese" },
                ],
            });
            const result = await menuEditService.fetchElements(
                MenuElements.INGREDIENT
            );
            expect(result[0]).toBeInstanceOf(Ingredients);
            expect(result[1].name).toBe("Cheese");
        });

        it("fetches PRODUCT elements and maps to Product instances", async () => {
            fetch.mockResolvedValueOnce({
                data: [
                    {
                        id: 1,
                        name: "Pizza Margherita",
                        price: 10,
                        vatrate: 10,
                        ingredients: [{ id: 1, name: "Tomato" }],
                        addons: [
                            { id: 2, name: "Cheese", price: 1, vatrate: 10 },
                        ],
                        categories: [
                            { id: 1, name: "Pizza", categoryType: "category" },
                        ],
                    },
                ],
            });
            const result = await menuEditService.fetchElements(
                MenuElements.PRODUCT
            );
            expect(result[0]).toBeInstanceOf(Product);
            expect(result[0].name).toBe("Pizza Margherita");
            expect(result[0].ingredients[0]).toBeInstanceOf(Ingredients);
            expect(result[0].addons[0]).toBeInstanceOf(Addon);
        });

        it("fetches MENU elements and maps to Menu instances", async () => {
            fetch.mockResolvedValueOnce({
                data: [
                    {
                        id: 1,
                        name: "Menu 1",
                        price: 20,
                        vatrate: 10,
                        menuItems: [
                            {
                                id: 11,
                                optional: false,
                                price: 10,
                                vatrate: 10,
                                products: [
                                    {
                                        id: 101,
                                        name: "Pizza",
                                        price: 10,
                                        vatrate: 10,
                                        addons: [],
                                        categories: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            const result = await menuEditService.fetchElements(
                MenuElements.MENU
            );
            expect(result[0]).toBeInstanceOf(Menu);
            expect(result[0].menuItems[0]).toBeInstanceOf(MenuItem);
            expect(result[0].menuItems[0].products[0]).toBeInstanceOf(Product);
        });

        it("fetches PAYMENT_TYPE elements and maps to PaymentType instances", async () => {
            fetch.mockResolvedValueOnce({
                data: [
                    { id: 1, name: "Cash", isEnable: true },
                    { id: 2, name: "Card", isEnable: false },
                ],
            });
            const result = await menuEditService.fetchElements(
                MenuElements.PAYMENT_TYPE
            );
            expect(result[0]).toBeInstanceOf(PaymentType);
            expect(result[1].name).toBe("Card");
        });

        it("throws error if fetch fails", async () => {
            fetch.mockRejectedValueOnce("Network error");
            await expect(
                menuEditService.fetchElements(MenuElements.ADDON)
            ).rejects.toThrow();
        });
    });

    describe("createNewElement", () => {
        it("calls post with correct key for SUBCATEGORY", async () => {
            post.mockResolvedValueOnce({ status: 201 });
            await menuEditService.createNewElement(MenuElements.SUBCATEGORY, {
                foo: "bar",
            });
            expect(post).toHaveBeenCalledWith(
                "category/sub",
                expect.any(String)
            );
        });

        it("calls post with correct key for PAYMENT_TYPE", async () => {
            post.mockResolvedValueOnce({ status: 201 });
            await menuEditService.createNewElement(MenuElements.PAYMENT_TYPE, {
                foo: "bar",
            });
            expect(post).toHaveBeenCalledWith(
                "payment/type",
                expect.any(String)
            );
        });

        it("calls post with enum key for other types", async () => {
            post.mockResolvedValueOnce({ status: 201 });
            await menuEditService.createNewElement(MenuElements.ADDON, {
                foo: "bar",
            });
            expect(post).toHaveBeenCalledWith("addon", expect.any(String));
        });
    });

    describe("updateElement", () => {
        it("calls put with correct key for SUBCATEGORY", async () => {
            put.mockResolvedValueOnce({ status: 200 });
            await menuEditService.updateElement(MenuElements.SUBCATEGORY, {
                foo: "bar",
            });
            expect(put).toHaveBeenCalledWith(
                "category/sub",
                expect.any(String)
            );
        });

        it("calls put with enum key for other types", async () => {
            put.mockResolvedValueOnce({ status: 200 });
            await menuEditService.updateElement(MenuElements.ADDON, {
                foo: "bar",
            });
            expect(put).toHaveBeenCalledWith("addon", expect.any(String));
        });
    });

    describe("deleteElement", () => {
        it("calls remove with correct key and id", async () => {
            remove.mockResolvedValueOnce({ status: 204 });
            await menuEditService.deleteElement(MenuElements.ADDON, { id: 42 });
            expect(remove).toHaveBeenCalledWith("addon", 42);
        });
    });
});
