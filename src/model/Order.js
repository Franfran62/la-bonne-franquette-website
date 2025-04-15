import status from "@/model/Status.js";
import {id} from "vuetify/locale";

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
    paiements;


    constructor(commandId, numero, prixTTC, surPlace, status, paiementTypeCommande, dateSaisie, dateLivraison, articles, nbArticles, menus, paiementSet, paye) {
        this.id = id;
        this.numero = numero;
        this.prixTTC = prixTTC;
        this.surPlace = surPlace;
        this.status = status[status] || null;
        this.paiementType = paiementTypeCommande;
        this.dateSaisie = dateSaisie;
        this.dateLivraison = dateLivraison;
        this.articles = articles;
        this.nbArticles = nbArticles;
        this.menus = menus;
        this.paiements = paiementSet;
        this.paye = paye;
    }
}



export default Order;