const reducer = (state = {}, action) => {
    const type = action.type;
    let user = state;

    switch (type) {
        case "LOGGED_IN":
            user = {
                authenticated: true,
                token: action.payload.data.token,
                data: action.payload.data,
            };
            break;

        case "LOGGED_OUT":
            user = {
                authenticated: false,
                token: null,
            };
            break;
    }
    return user;
};

export default reducer;
