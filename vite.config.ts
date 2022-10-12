import path from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
export default defineConfig({
    build: {
        lib: {
            entry: path.join(__dirname, "lib", "index.ts"),
            name: "t3d",
            fileName: (format) => `index.${format}.js`,
            formats: ["es", "cjs", "umd"],
        },

        sourcemap: true,
        minify: "terser",
        emptyOutDir: true,
    },

    plugins: [dts({ insertTypesEntry: true })],
});
