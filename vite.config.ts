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
            "@interfaces": path.resolve(__dirname, "src/interfaces"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@context": path.resolve(__dirname, "src/context"),
            "@lib": path.resolve(__dirname, "src/lib"),
            "@config": path.resolve(__dirname, "src/config"),
        },
    },
});
