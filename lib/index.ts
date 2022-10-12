import { WebGLRenderer } from "./renderer";

export class Game {
    public renderer: WebGLRenderer;

    public constructor(root: HTMLElement) {
        this.renderer = new WebGLRenderer(root);
    }
}

export * from "./renderer";
export * from "./math";
export * from "./shaders";
