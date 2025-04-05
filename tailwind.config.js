const colors = require("tailwindcss/colors");

module.exports = {
    enabled: true,
    mode: "jit",
    content: [
        // Example content paths...
        "./public/**/*.html",
        "./src/**/*.{js,jsx,ts,tsx,vue}",
    ],

    darkMode: "class", // class, 'media' or boolean
    theme: {
        extend: {
            colors: {
                gray: {
                    900: "#202225",
                    800: "#2f3136",
                    700: "#36393f",
                    600: "#4f545c",
                    400: "#d4d7dc",
                    300: "#e3e5e8",
                    200: "#ebedef",
                    100: "#f2f3f5",
                },
                primary: "#143b46",
                secondary: "#2b6d7e",
            },
            spacing: {
                88: "22rem",
            },

            gridTemplateColumns: {
                24: "repeat(24, minmax(0, 1fr))",
                64: "repeat(64, minmax(0, 1fr))",
            },
            animation: {
                "cpu-spin": "spin 2s linear infinite",
            },
        },
    },
    variants: {},
    plugins: [],
};
