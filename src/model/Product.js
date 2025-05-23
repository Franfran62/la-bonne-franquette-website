import HasPrice from "@/model/HasPrice.js";

class Product extends HasPrice{
    name;
    ingredients;
    addons;
    modified;
    quantity;

    constructor(name, price, ingredients, addons, modified, quantity, vatRate) {
        console.log(addons);
        super(price,vatRate);
        this.name = name;
        this.price = price;
        this.ingredients = ingredients;
        this.addons = addons;
        this.modified = modified;
        this.quantity = quantity;
    }

}

export default Product;
//TODO: Modification du calcul du prix total (avec TVA) lors de la création d'un produit