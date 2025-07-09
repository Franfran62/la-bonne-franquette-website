const getEnumKeyByValue = (enumObj, value) => {
    return Object.keys(enumObj).find(
        key => enumObj[key] === value
    );
};

export {getEnumKeyByValue};