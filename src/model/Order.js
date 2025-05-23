import {id} from "vuetify/locale";
import Status from "@/model/Status.js";
import HasPrice from "@/model/HasPrice.js";
import VATRate from "@/model/VATRate.js";

class Order extends HasPrice{
    //Pour les Commandes, le prix HT correspond au prix TTC, expliquant la valeur de la TVA à Aucun
    id;
    number;
    dineIn;
    paid;
    status;
    paymentType;
    creationDate;
    deliveryDate;
    articles;
    totalItems;
    menus;
    payments;

    constructor(commandId, number, price, dineIn, status, paymentType, creationDate, deliveryDate, articles, totalItems, menus, payments, paid) {
        super(price, VATRate.AUCUN);
        this.id = id;
        this.number = number;
        this.dineIn = dineIn;
        this.status = Status[status] || null;
        this.paymentType = paymentType;
        this.creationDate = creationDate;
        this.deliveryDate = deliveryDate;
        this.articles = articles;
        this.totalItems = totalItems;
        this.menus = menus;
        this.payments = payments;
        this.paid = paid;
    }

    getNumeroToString = () => {
        return this.number < 10 ? "00" + this.number
            : this.number < 100 ? "0" + this.number
            : this.number.toString();
    }

    getDateSaisieAndHourToString = () => {
        const options = { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" };
        return new Intl.DateTimeFormat("fr-FR", options).format(new Date(this.creationDate));
    }

    getDateSaisieToString = () => {
        const options = { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", year: "numeric" };
        return new Intl.DateTimeFormat("fr-FR", options).format(new Date(this.creationDate));
    }

    getNbArticlesToString = () => {
        if(this.totalItems >= 100) return "99+"
        return this.totalItems.toString();
    }
}

export default Order;