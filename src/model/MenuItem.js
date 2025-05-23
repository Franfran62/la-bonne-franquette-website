import {id} from "vuetify/locale";
import VATRate, {getMultFromVAT} from "@/model/VATRate.js";

class MenuItem {
    id;
    name;
    products;
    optional;
    price;
    totalPrice;
    VATRate;

    constructor(id, name, products, optional, price, VATRate) {
        this.id = id;
        this.name = name;
        this.products = products;
        this.optional = optional;
        this.price = price;
        this.totalPrice = price * getMultFromVAT(VATRate);
        this.VATRate = VATRate;
    }
}

export default MenuItem;