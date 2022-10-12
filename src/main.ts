import "./styles/main.scss";
import { Game } from "../lib";

const main = () => {
    const root = document.getElementById("app")! as HTMLDivElement;
    new Game(root);
};

window.addEventListener("load", main);
