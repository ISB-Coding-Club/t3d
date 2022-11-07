import { defineConfig } from "vite";
import ViteRsw from "vite-plugin-rsw";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ViteRsw()],

    server: {
        host: "0.0.0.0",

        hmr: {
            protocol: "ws",
            host: "dns.kadaroja.com",
            clientPort: 3001,
            port: 3001,
        },

        port: 3001,
    },
});
