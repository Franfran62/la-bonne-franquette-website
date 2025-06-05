import {getMultFromVAT} from "@/model/VATRate.js";

class HasPrice {
    price;
    totalPrice;
    vatrate;

    constructor(price, vatrate) {
        if (new.target === HasPrice) {
            throw new Error("La classe HasPrice est abstraite et ne peut pas être instanciée directement.");
        }
        this.price = price;
        this.vatrate = vatrate;
        this.totalPrice = price * getMultFromVAT(vatrate);
    }

    getPriceToString() {
        return (this.totalPrice / 100).toFixed(2).replace('.', ',');
    }
}

export default HasPrice;