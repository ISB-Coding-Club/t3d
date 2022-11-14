import css from "./styles/main.css";
import { Game } from "@t3d-engine/engine/src";

const loadCss = async () => {
    const link = document.createElement("link");

    link.href = css;
    link.type = "text/css";
    link.rel = "stylesheet";

    const waiter = new Promise((resolve) =>
        link.addEventListener("load", () => resolve(true))
    );

    document.head.appendChild(link);

    await waiter;
};

const main = async () => {
    try {
        await loadCss();

        const root = document.getElementById("app")! as HTMLDivElement;
        const game = await Game.setup(root, true);

        await game.renderer.scene.debugLayer.show();
    } catch (e) {
        alert(e);
    }
};

window.addEventListener("load", main);
