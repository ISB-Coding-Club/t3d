import esbuild from "esbuild";
import path from "path";

const main = async () => {
    await esbuild.build({
        entryPoints: [path.join(__dirname, "src", "index.ts")],
        bundle: true,
        outdir: path.join(__dirname, "dist"),
        sourcemap: true,
        minify: true,
        platform: "browser",
    });
};

main();
