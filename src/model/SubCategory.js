import Category from "@/model/Category.js";
import {id} from "vuetify/locale";

class SubCategory extends Category {
     categoryId;

    constructor(id, name, products, categoryId) {
        super(id, name, products);
        this.categoryId = categoryId;
    }
}

export default SubCategory;