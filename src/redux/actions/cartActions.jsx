export const addProduct = (product) => ({
    type: "ADD_PRODUCT",
    payload: {
        product: product,
    },
});
export const removeProduct = (product) => ({
    type: "REMOVE_PRODUCT",
    payload: {
        product: product,
    },
});
export const incrementProduct = (product) => ({
    type: "INC_PRODUCT",
    payload: {
        product: product,
    },
});
export const decrementProduct = (product) => ({
    type: "DEC_PRODUCT",
    payload: {
        product: product,
    },
});
export const emptyCart = () => ({
    type: "EMPTY_CART",
});
