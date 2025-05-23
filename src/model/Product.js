class Product {
    name;
    price;
    ingredients;
    addons;
    modified;
    quantity;

    constructor(name, price, ingredients, addons, modified, quantity) {
        this.name = name;
        this.price = price;
        this.ingredients = ingredients;
        this.addons = addons;
        this.modified = modified;
        this.quantity = quantity;
    }

    getPriceToString = () => {
        return (this.price / 100).toFixed(2).replace('.', ',');
    }
}

export default Product;
//TODO: Modification du calcul du prix total (avec TVA) lors de la création d'un produit