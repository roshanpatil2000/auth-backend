export const convertToLowercase = (value = "") => {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
};


export const convertToUppercase = (value = "") => {
    return value.trim().toUpperCase().replace(/\s+/g, " ");
};