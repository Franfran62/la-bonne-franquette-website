import {id} from "vuetify/locale";
import Status from "@/model/Status.js";

class Order {
    id;
    numero;
    prixTTC;
    surPlace;
    paye;
    status;
    paiementType;
    dateSaisie;
    dateLivraison;
    articles;
    nbArticles;
    menus;
    payments;

    constructor(commandId, numero, prixTTC, surPlace, status, paiementTypeCommande, dateSaisie, dateLivraison, articles, nbArticles, menus, paiementSet, paye) {
        this.id = id;
        this.numero = numero;
        this.prixTTC = prixTTC;
        this.surPlace = surPlace;
        this.status = Status[status] || null;
        this.paiementType = paiementTypeCommande;
        this.dateSaisie = dateSaisie;
        this.dateLivraison = dateLivraison;
        this.articles = articles;
        this.nbArticles = nbArticles;
        this.menus = menus;
        this.payments = paiementSet;
        this.paye = paye;
    }

    getNumeroToString = () => {
        return this.numero < 10 ? "00" + this.numero
            : this.numero < 100 ? "0" + this.numero
            : this.numero.toString();
    }

    getPrixTTCToString = () => {
        console.log(this);
        return (this.prixTTC / 100).toFixed(2).replace('.', ',');
    }

    getDateSaisieAndHourToString = () => {
        const options = { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" };
        return new Intl.DateTimeFormat("fr-FR", options).format(new Date(this.dateSaisie));
    }

    getDateSaisieToString = () => {
        const options = { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", year: "numeric" };
        return new Intl.DateTimeFormat("fr-FR", options).format(new Date(this.dateSaisie));
    }

    getNbArticlesToString = () => {
        if(this.nbArticles >= 100) return "99+"
        return this.nbArticles.toString();
    }
}

export default Order;