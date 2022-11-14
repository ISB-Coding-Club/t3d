export * from "@t3d-engine/core/src";
export * from "@t3d-engine/debugger/src";
export * from "@t3d-engine/renderer/src";
export * from "@t3d-engine/serialization/src";
export * from "@t3d-engine/shaders/src";
export * from "@t3d-engine/util/src";
export * from "@t3d-engine/physics/src";

import "pepjs";
import { BabylonJSRenderer } from "@t3d-engine/renderer/src";

export class Game {
    public renderer: BabylonJSRenderer;

    private constructor(renderer: BabylonJSRenderer) {
        this.renderer = renderer;
    }

    public static async setup(root: HTMLElement, debug?: boolean) {
        return new Game(await BabylonJSRenderer.setup(root, debug));
    }
}
