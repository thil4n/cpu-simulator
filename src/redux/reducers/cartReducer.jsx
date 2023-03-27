const reducer = (state = [], action) => {
    switch (action.type) {
        case "REMOVE_PRODUCT": {
            const { product } = action.payload;
            const updatedProducts = state.filter(
                (item) => item.id !== product.id
            );
            return updatedProducts;
        }
        case "EMPTY_CART": {
            return [];
        }
        case "INC_PRODUCT": {
            const { product } = action.payload;
            const productIndex = state.findIndex(
                (item) => item.id === product.id
            );
            const updatedProducts = [...state];
            updatedProducts[productIndex].count++;
            return updatedProducts;
        }
        case "DEC_PRODUCT": {
            const { product } = action.payload;
            const productIndex = state.findIndex(
                (item) => item.id === product.id
            );
            const updatedProducts = [...state];
            updatedProducts[productIndex].count--;
            return updatedProducts;
        }
        case "ADD_PRODUCT": {
            const { product } = action.payload;
            const updatedProducts = [...state, { ...product, count: 1 }];
            return updatedProducts;
        }
        default:
            return state;
    }
};

export default reducer;
