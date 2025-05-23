import HasPrice from "@/model/HasPrice.js";

class Menu extends HasPrice {
    name;
    articles;
    modified;
    quantity;
    menuItems;

    constructor(name, price, articles, modified, quantity, menuItems, vatRate) {
        super(price,vatRate);
        this.name = name;
        this.price = price;
        this.articles = articles;
        this.modified = modified;
        this.quantity = quantity;
        this.menuItems = menuItems;
    }
/*
    getPriceToString = () => {
        return (this.price / 100).toFixed(2).replace('.', ',');
    }*/
}

export default Menu;
//TODO: Modification du calcul du prxi avec TVA lors de la création d'un Menu