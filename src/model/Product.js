class Product {
    name;
    price;
    ingredients;
    extras;
    modified;
    quantity;

    constructor(name, price, ingredients, extras, modified, quantity) {
        this.name = name;
        this.price = price;
        this.ingredients = ingredients;
        this.extras = extras;
        this.modified = modified;
        this.quantity = quantity;
    }

    getPriceToString = () => {
        return (this.price / 100).toFixed(2).replace('.', ',');
    }
}

export default Product;
