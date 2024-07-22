import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    server: {
        host: true,
    },
    plugins: [react()],
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, "src/components"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@services": path.resolve(__dirname, "src/services"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@config": path.resolve(__dirname, "src/config"),
        },
    },
});
