class Menu {
    name;
    price;
    articles;
    modified;
    quantity;

    constructor(name, price, articles, modified, quantity) {
        this.name = name;
        this.price = price;
        this.articles = articles;
        this.modified = modified;
        this.quantity = quantity;
    }

    getPriceToString = () => {
        return (this.price / 100).toFixed(2).replace('.', ',');
    }
}

export default Menu;