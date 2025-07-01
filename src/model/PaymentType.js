class PaymentType{
    id;
    name;
    isEnable;

    constructor(id, name, isEnable) {
        this.id = id;
        this.name = name;
        this.isEnable = isEnable;
    }
}

export default PaymentType;