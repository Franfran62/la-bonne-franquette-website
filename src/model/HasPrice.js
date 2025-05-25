import { getMultFromVAT } from "@/model/VATRate.js";

class HasPrice {
    constructor(price, vatRate) {
        if (new.target === HasPrice) {
            throw new Error("La classe HasPrice est abstraite et ne peut pas être instanciée directement.");
        }
        this.price = price;
        this.vatRate = vatRate;
        this.totalPrice = price * getMultFromVAT(vatRate);
    }

    getPriceToString() {
        return (this.totalPrice / 100).toFixed(2).replace('.', ',');
    }
}

export default HasPrice;