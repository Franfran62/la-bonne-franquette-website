class Category {
    id;
    name;
    products;
    categoryType;

    constructor(id, name, products, categoryType) {
        this.id = id;
        this.name = name;
        this.products = products;
        this.categoryType = categoryType;
    }
}

export default Category;