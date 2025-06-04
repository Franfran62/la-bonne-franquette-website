import HasPrice from "@/model/HasPrice.js";

class MenuItem extends HasPrice {
    id;
    products;
    optional;

    constructor(id, products, optional, price, vatRate) {
        super(price, vatRate);
        this.id = id;
        this.products = products;
        this.optional = optional;
    }
}

export default MenuItem;