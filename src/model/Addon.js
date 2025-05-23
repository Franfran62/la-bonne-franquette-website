import VATRate, {getMultFromVAT} from "@/model/VATRate.js";

class Addon {
    id;
    name;
    price;
    totalPrice;
    VATRate;
    ingredient;

    constructor(id, name, price, totalPrice, VATRate, ingredient) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.totalPrice = this.totalPrice = price * getMultFromVAT(VATRate);
        this.VATRate = VATRate;
        this.ingredient = ingredient;
    }
}

export default Addon;