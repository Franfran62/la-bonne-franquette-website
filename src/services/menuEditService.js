import MenuElements from "@/model/MenuElements.js";
import {fetch, post, put, remove} from "@/services/axiosService.js";
import Addon from "@/model/Addon.js";
import Category from "@/model/Category.js";
import Ingredients from "@/model/Ingredients.js";
import SubCategory from "@/model/SubCategory.js";
import Product from "@/model/Product.js";
import Menu from "@/model/Menu.js";
import MenuItem from "@/model/MenuItem.js";
import {getEnumKeyByValue} from "@/helpers/enumuHelpers.js";

//Fonction pour séparer les catégories des sous-catégories
const getCategories = (data) => {
    const categories = [];
    const subCategories = [];
    data.map(e => {
        if (e["categoryType"] === "category") {
            categories.push(new Category(e["id"], e["name"], [], e["categoryType"]));
        } else if (e["categoryType"] === "sub-category") {
            subCategories.push(new SubCategory(e["id"], e["name"], [], e["categoryId"], e["categoryType"]));
        }
    });
    return categories.concat(subCategories);
};

//Nettoie le corps d'une requête pour ne pas avoir de récursion infinie
const cleanData = (data) => {
    const seen = new WeakSet();
    return JSON.stringify(data, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    });
}

const createNewElement = async (type, payload) => {
    const data = cleanData(payload);
    if (type === MenuElements.SUBCATEGORY) {
        return post("category/sub", data);
    } else {
        const key = getEnumKeyByValue(MenuElements, type).toLowerCase();
        return post(key, data);
    }
}

const updateElement = async (type, payload) => {
    const data = cleanData(payload);
    if (type === MenuElements.SUBCATEGORY) {
        return put("category/sub", data);
    } else {
        const key = getEnumKeyByValue(MenuElements, type).toLowerCase();
        return put(key, data);
    }
}

const deleteElement = async (type, element) => {
    const key = getEnumKeyByValue(MenuElements, type).toLowerCase();
    return remove(key, element.id);
}

const fetchElements = async (type) => {
    const result = [];
    let key;
    if (type === MenuElements.SUBCATEGORY) {
        key = "category";
    } else {
        key = getEnumKeyByValue(MenuElements, type).toLowerCase();
    }
    try {
        const response = await fetch(key);
        switch (type) {
            case MenuElements.ADDON: {
                response.data.map(e => {
                    result.push(new Addon(e["id"], e["name"], e["price"], e["VATRate"]));
                });
                return result;
            }
            case MenuElements.CATEGORY: {
                return getCategories(response.data);
            }
            case MenuElements.SUBCATEGORY: {
                return getCategories(response.data).filter(e => e instanceof SubCategory);
            }
            case MenuElements.INGREDIENT: {
                response.data.map(e => {
                    result.push(new Ingredients(e["id"], e["name"]));
                });
                return result;
            }
            case MenuElements.PRODUCT: {
                response.data.map(e => {
                    const productIngredients = [];
                    e["ingredients"].map(ingredient => {
                        productIngredients.push(new Ingredients(ingredient["id"], ingredient["name"]));
                    });
                    const productAddons = [];
                    e["addons"].map(addon => {
                        productAddons.push(new Addon(addon["id"], addon["name"], addon["price"], addon["vatrate"], []));
                    });
                    const categories = getCategories(e["categories"]);
                    const newProduct = new Product(e["name"], e["price"], productIngredients, productAddons, categories, false, 0, e["vatrate"], e["id"]);
                    result.push(newProduct);
                });
                return result;
            }
            case MenuElements.MENU: {
                response.data.map(e => {
                    const menuItems = [];
                    e["menuItems"].map(menuItem => {
                        const menuItemProducts = [];
                        menuItem["products"].map(product => {
                            const productIngredients = [];
                            const productAddons = [];
                            product["addons"].map(addon => {
                                productAddons.push(new Addon(addon["id"], addon["name"], addon["price"], addon["vatrate"], []));
                            });
                            const categories = getCategories(product["categories"]);
                            const newProduct = new Product(product["name"], product["price"], productIngredients, productAddons, categories, false, 0, product["vatrate"], product["id"]);
                            menuItemProducts.push(newProduct);
                        });
                        menuItems.push(new MenuItem(menuItem["id"], menuItemProducts, menuItem["optional"], menuItem["price"], menuItem["vatrate"]));
                    });
                    result.push(new Menu(e["name"], e["price"], [], false, 0, menuItems, e["vatrate"], e["id"]));
                });
                return result;
            }
        }
    } catch (e) {
        throw new Error(e);
    }
};

export {fetchElements, deleteElement, createNewElement, updateElement};