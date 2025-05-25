import VATRate from "@/model/VATRate.js";
import HasPrice from "@/model/HasPrice.js";

class Payment extends HasPrice{
    paymentType;
    paid;
    date;

    constructor(price, paymentType, paid, date) {
        super(price,VATRate.AUCUN);
        this.paymentType = paymentType;
        this.paid = paid;
        this.date = date;
    }

    getDateSaisieAndHourToString = () => {
        const options = {
            timeZone: "Europe/Paris",
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        };
        return new Intl.DateTimeFormat("fr-FR", options).format(new Date(this.date));
    }
}

export default Payment;