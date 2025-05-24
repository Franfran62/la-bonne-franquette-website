import HasPrice from "@/model/HasPrice.js";

class Menu extends HasPrice {
    name;
    articles;
    modified;
    quantity;
    menuItems;
    id;

    constructor(name, price, articles, modified, quantity, menuItems, vatRate, id) {
        super(price,vatRate);
        this.name = name;
        this.price = price;
        this.articles = articles;
        this.modified = modified;
        this.quantity = quantity;
        this.menuItems = menuItems;
        this.id = id;
    }
}

export default Menu;