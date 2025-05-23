const VATRate = Object.freeze({
    AUCUN: "Aucun",
    NORMAL: "Normal",
    INTERMEDIAIRE: "Intermédiaire",
});

const getMultFromVAT = (VATRate) => {
    switch (VATRate) {
        case VATRate.AUCUN: return 1;
        case VATRate.INTERMEDIAIRE: return 1.10;
        case VATRate.NORMAL: return 1.20;
        default: return 1;
    }
}

export default VATRate;
export {getMultFromVAT};