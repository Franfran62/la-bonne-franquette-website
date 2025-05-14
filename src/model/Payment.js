class Payment {
    price;
    paymentType;
    paid;
    date;

    constructor(price, paymentType, paid, date) {
        this.price = price;
        this.paymentType = paymentType;
        this.paid = paid;
        this.date = date;
    }

    getPriceToString = () => {
        return (this.price / 100).toFixed(2).replace('.', ',');
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