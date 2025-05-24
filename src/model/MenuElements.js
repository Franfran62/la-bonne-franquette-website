const MenuElements = Object.freeze({
    CATEGORY:"Catégories",
    SUBCATEGORY:"Sous-catégories",
    ADDON: "Extras",
    INGREDIENT: "Ingrédients",
    PRODUCT: "Produits",
    MENU: "Menus",
});

const getEnumKeyByValue = (enumObj, value) => {
    return Object.keys(enumObj).find(key => enumObj[key] === value);
};

export default MenuElements;
export {getEnumKeyByValue};