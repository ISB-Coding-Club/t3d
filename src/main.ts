import "./styles/main.scss";
import { Game } from "./t3d";

const main = () => {
    const root = document.getElementById("app")! as HTMLDivElement;
    const game = new Game(root);
};

window.addEventListener("load", main);
