import Category from "@/model/Category.js";

class SubCategory extends Category {
     categoryId;

    constructor(id, name, products, categoryId) {
        super(id, name, products);
        this.categoryId = categoryId;
    }
}

export default SubCategory;