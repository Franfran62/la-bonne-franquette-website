import HasPrice from "@/model/HasPrice.js";

class MenuItem extends HasPrice {
    id;
    name;
    products;
    optional;

    constructor(id, name, products, optional, price, vatRate) {
        super(price, vatRate);
        this.id = id;
        this.name = name;
        this.products = products;
        this.optional = optional;
    }
}

export default MenuItem;