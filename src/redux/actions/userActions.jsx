export const userLoggedIn = (data) => ({
    type: "LOGGED_IN",
    payload: {
        data,
    },
});

export const userLoggedOut = () => ({
    type: "LOGGED_OUT",
});
