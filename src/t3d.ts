import { WebGLRenderer2D, WebGLRenderer3D } from "./renderer";

export class Game {
    public renderer: WebGLRenderer2D | WebGLRenderer3D;

    public constructor(root: HTMLElement, is2D = false) {
        this.renderer = is2D
            ? new WebGLRenderer2D(root)
            : new WebGLRenderer3D(root);
    }
}

export * from "./renderer";
