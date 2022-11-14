import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    CreateSphere,
    Mesh,
} from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";

export class BabylonJSRenderer {
    public root: HTMLElement;
    public canvas: HTMLCanvasElement;
    public engine: Engine;
    public scene: Scene;
    public camera: FreeCamera;
    public light: HemisphericLight;
    public sphere: Mesh;
    public material: GridMaterial;

    public constructor(root: HTMLElement, debug?: boolean) {
        this.root = root;

        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.root.appendChild(this.canvas);

        this.engine = new Engine(this.canvas);
        this.scene = new Scene(this.engine);

        this.camera = new FreeCamera(
            "main_camera",
            new Vector3(0, 5, -10),
            this.scene
        );
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvas, true);

        this.light = new HemisphericLight(
            "main_light",
            new Vector3(0, 1, 0),
            this.scene
        );
        this.light.intensity = 0.7;

        this.material = new GridMaterial("grid", this.scene);

        this.sphere = CreateSphere(
            "sphere1",
            { segments: 16, diameter: 2 },
            this.scene
        );
        this.sphere.position.y = 2;
        this.sphere.material = this.material;

        if (debug) this.scene.debugLayer.show();

        this.handleResize();
        this.start();
    }

    public static async setup(root: HTMLElement, debug?: boolean) {
        return new BabylonJSRenderer(root, debug);
    }

    public handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.engine.resize();
    }

    public start() {
        this.engine.runRenderLoop(this.update.bind(this));
    }

    public update() {
        this.scene.render();
    }
}
