import VATRate, {getMultFromVAT} from "@/model/VATRate.js";
import HasPrice from "@/model/HasPrice.js";

class Addon extends HasPrice{
    id;
    name;
    ingredient;

    constructor(id, name, price, totalPrice, VATRate, ingredient) {
        super(price,VATRate);
        this.id = id;
        this.name = name;
        this.ingredient = ingredient;
    }
}

export default Addon;