import MenuElements from "@/model/MenuElements.js";
import {fetch, remove} from "@/services/axiosService.js";
import Addon from "@/model/Addon.js";
import Category from "@/model/Category.js";
import Ingredients from "@/model/Ingredients.js";
import SubCategory from "@/model/SubCategory.js";
import Product from "@/model/Product.js";
import Menu from "@/model/Menu.js";
import MenuItem from "@/model/MenuItem.js";

const getEnumKeyByValue = (enumObj, value) => {
    return Object.keys(enumObj).find(key => enumObj[key] === value);
};

const fetchElements = async (type) => {
    const result = [];
    const key = getEnumKeyByValue(MenuElements, type).toLowerCase();
    try {
        const response = await fetch(key);
        switch (type) {
            case MenuElements.ADDON: {
                response.data.map(e => {
                    result.push(new Addon(e["id"],  e["name"], e["prixHT"], e["tauxTVA"], []));
                })
                return result;
            }
            case MenuElements.CATEGORY: {
                const categories = [];
                const subCategories = [];
                response.data.map(e => {
                    if (e["categoryType"] === "category") {
                        categories.push(new Category(e["id"], e["name"], []));
                    } else {
                        subCategories.push(new SubCategory(e["id"], e["name"], [], e["categoryId"]));
                    }
                });
                return categories.concat(subCategories);
            }
            case MenuElements.INGREDIENT: {
                response.data.map(e => {
                    result.push(new Ingredients(e["id"], e["name"]));
                })
                return result;
            }
            case MenuElements.PRODUCT: {
                response.data.map(e => {
                    console.log(e);
                    const productIngredients = [];
                    e["ingredients"].map(ingredient => {
                        productIngredients.push(new Ingredients(ingredient["id"], ingredient["name"]));
                    })
                    const productAddons = [];
                    e["addons"].map(addon => {
                        productAddons.push(new Addon(addon["id"], addon["prixHT"], addon["name"], addon["tauxTVA"], []));
                    })
                    const newProduct = new Product(e["name"],e["price"], productIngredients, productAddons, false, 0, e["TauxTVA"], e["id"]);
                    console.log(newProduct);
                    result.push(newProduct);
                    return result;
                })
                return result;
            }
            case MenuElements.MENU: {
                response.data.map(e => {
                    const menuItems = [];
                    e["menuItems"].map(menuItem => {
                        const menuItemProducts = [];
                        menuItem["products"].map(product => {
                            const productIngredients = [];
/*                            product["ingredients"].map(ingredient => {
                                productIngredients.push(new Ingredients(ingredient["id"], ingredient["name"]));
                            })*/
                            const productAddons = [];
                            product["addons"].map(addon => {
                                productAddons.push(new Addon(addon["id"], addon["prixHT"], addon["name"], addon["tauxTVA"], []));
                            })
                            const newProduct = new Product(e["name"],e["price"], productIngredients, productAddons, false, false, e["id"]);
                            menuItemProducts.push(newProduct);
                            }
                        );
                        menuItems.push(new MenuItem(menuItem["id"], menuItem["name"], menuItemProducts, menuItem["optional"], menuItem["prixHT"], menuItem["tauxTVA"]));
                    });
                    result.push(new Menu(e["name"],e["prixHT"],[],false,0,menuItems,e["tauxTVA"],e["id"]));
                })
                return result;
            }
        }
    } catch (e) {
        throw new Error(e);
    }
}

const deleteElement = async (type, element) => {
    const key = getEnumKeyByValue(MenuElements, type).toLowerCase();
    console.log("key",key);
    console.log("element",element);
    console.log("id",element.id);
    return remove(key, element.id);
}
export {fetchElements, deleteElement};