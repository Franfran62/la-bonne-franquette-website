import Category from "@/model/Category.js";

class SubCategory extends Category {
     categoryId;

    constructor(id, name, products, categoryId, categoryType) {
        super(id, name, products, categoryType);
        this.categoryId = categoryId;
    }
}

export default SubCategory;