import {id} from "vuetify/locale";
import Status from "@/model/Status.js";

class Order {
    id;
    number;
    totalPrice;
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

    constructor(commandId, number, totalPrice, dineIn, status, paymentType, creationDate, deliveryDate, articles, totalItems, menus, payments, paid) {
        this.id = id;
        this.number = number;
        this.totalPrice = totalPrice;
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

    getPrixTTCToString = () => {
        console.log(this);
        return (this.totalPrice / 100).toFixed(2).replace('.', ',');
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