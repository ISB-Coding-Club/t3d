import { mat4 } from "gl-matrix";

import { initShaders } from "../shaders";
import { WebGLBuffers, WebGLProgramInfo } from "../types";

export class WebGLRenderer2D {
    private canvas: HTMLCanvasElement;
    private context?: WebGLRenderingContext | WebGL2RenderingContext;
    private programInfo?: WebGLProgramInfo;
    private buffers?: WebGLBuffers;
    private squareRotation = 0.0;
    private previous = 0;

    public constructor(root: HTMLElement) {
        this.canvas = document.createElement("canvas");

        this.canvas.width = root.clientWidth;
        this.canvas.height = root.clientHeight;

        root.appendChild(this.canvas);

        this.initWebGL();
        this.setup();
        this.initBuffers();
        requestAnimationFrame(this.render.bind(this));
    }

    private initWebGL() {
        const webgl1 = this.canvas.getContext("webgl");
        const webgl2 = this.canvas.getContext("webgl2");

        if (webgl2) {
            this.context = webgl2;
        } else {
            console.log(
                "Browser does not support WebGL 2, so falling back to WebGL 1."
            );

            if (webgl1) {
                this.context = webgl1;
            } else {
                throw new ReferenceError("Browser does not support WebGL!");
            }
        }
    }

    private setup() {
        if (!this.context) return;

        this.context.clearColor(0.0, 0.0, 0.0, 1.0);
        this.context.clear(this.context.COLOR_BUFFER_BIT);

        const shaderProgram = initShaders(this.context);

        this.programInfo = {
            program: shaderProgram,

            attribLocations: {
                vertexPosition: this.context.getAttribLocation(
                    shaderProgram,
                    "aVertexPosition"
                ),

                vertexColor: this.context.getAttribLocation(
                    shaderProgram,
                    "aVertexColor"
                ),
            },

            uniformLocations: {
                projectionMatrix: this.context.getUniformLocation(
                    shaderProgram,
                    "uProjectionMatrix"
                ),
                modelViewMatrix: this.context.getUniformLocation(
                    shaderProgram,
                    "uModelViewMatrix"
                ),
            },
        };
    }

    private initBuffers() {
        if (!this.context) return;

        const colors = [
            1.0,
            1.0,
            1.0,
            1.0, // white
            1.0,
            0.0,
            0.0,
            1.0, // red
            0.0,
            1.0,
            0.0,
            1.0, // green
            0.0,
            0.0,
            1.0,
            1.0, // blue
        ];

        const colorBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, colorBuffer);

        this.context.bufferData(
            this.context.ARRAY_BUFFER,
            new Float32Array(colors),
            this.context.STATIC_DRAW
        );

        const positionBuffer = this.context.createBuffer();

        this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer);

        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

        this.context.bufferData(
            this.context.ARRAY_BUFFER,
            new Float32Array(positions),
            this.context.STATIC_DRAW
        );

        this.buffers = {
            position: positionBuffer!,
            color: colorBuffer!,
        };
    }

    private draw(deltaTime: number) {
        if (!this.context || !this.programInfo) return;

        this.context.clearColor(0.0, 0.0, 0.0, 1.0);
        this.context.clearDepth(1.0);
        this.context.enable(this.context.DEPTH_TEST);
        this.context.depthFunc(this.context.LEQUAL);

        this.context.clear(
            this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT
        );

        const fieldOfView = (45 * Math.PI) / 180;
        const aspect =
            this.context.canvas.clientWidth / this.context.canvas.clientHeight;

        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            this.squareRotation,
            [0, 0, 1]
        );

        let numComponents = 2;
        let type = this.context.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;

        this.context.bindBuffer(
            this.context.ARRAY_BUFFER,
            this.buffers!.position
        );

        this.context.vertexAttribPointer(
            this.programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );

        this.context.enableVertexAttribArray(
            this.programInfo.attribLocations.vertexPosition
        );

        numComponents = 4;
        type = this.context.FLOAT;
        normalize = false;
        stride = 0;
        offset = 0;

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.buffers!.color);
        this.context.vertexAttribPointer(
            this.programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        this.context.enableVertexAttribArray(
            this.programInfo.attribLocations.vertexColor
        );

        this.context.useProgram(this.programInfo.program);

        this.context.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        );

        this.context.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        );

        offset = 0;
        const vertexCount = 4;

        this.context.drawArrays(
            this.context.TRIANGLE_STRIP,
            offset,
            vertexCount
        );

        this.squareRotation += deltaTime;
    }

    private render(delta: number) {
        const deltaTime = delta * 0.001 - this.previous;
        this.previous = delta * 0.001;

        this.draw(deltaTime);

        requestAnimationFrame(this.render.bind(this));
    }
}
