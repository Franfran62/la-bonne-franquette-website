import HasPrice from "@/model/HasPrice.js";

class Product extends HasPrice{
    id;
    name;
    ingredients;
    addons;
    modified;
    quantity;

    constructor(name, price, ingredients, addons, modified, quantity, vatRate, id) {
        super(price,vatRate);
        this.name = name;
        this.ingredients = ingredients;
        this.addons = addons;
        this.modified = modified;
        this.quantity = quantity;
        this.id = id;
    }

}

export default Product;