import HasPrice from "@/model/HasPrice.js";

class Addon extends HasPrice{
    id;
    name;

    constructor(id, name, price, VATRate) {
        super(price,VATRate);
        this.id = id;
        this.name = name;
    }
}

export default Addon;