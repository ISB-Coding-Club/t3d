import { mat4 } from "gl-matrix";

import { initShaders } from "../shaders";
import { WebGLBuffers, WebGLProgramInfo } from "../types";

export class WebGLRenderer3D {
    private canvas: HTMLCanvasElement;
    private context?: WebGLRenderingContext | WebGL2RenderingContext;
    private programInfo?: WebGLProgramInfo;
    private buffers?: WebGLBuffers;
    private cubeRotation = 0.0;
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

        const faceColors = [
            [1.0, 1.0, 1.0, 1.0], // Front face: white
            [1.0, 0.0, 0.0, 1.0], // Back face: red
            [0.0, 1.0, 0.0, 1.0], // Top face: green
            [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0], // Right face: yellow
            [1.0, 0.0, 1.0, 1.0], // Left face: purple
        ];

        let colors: number[] = [];

        for (let j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
            colors = colors.concat(c, c, c, c);
        }

        const colorBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, colorBuffer);

        this.context.bufferData(
            this.context.ARRAY_BUFFER,
            new Float32Array(colors),
            this.context.STATIC_DRAW
        );

        const positionBuffer = this.context.createBuffer();

        this.context.bindBuffer(this.context.ARRAY_BUFFER, positionBuffer);

        const positions = [
            // Front face
            -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
        ];

        this.context.bufferData(
            this.context.ARRAY_BUFFER,
            new Float32Array(positions),
            this.context.STATIC_DRAW
        );

        const indexBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, indexBuffer);

        const indices = [
            0,
            1,
            2,
            0,
            2,
            3, // front
            4,
            5,
            6,
            4,
            6,
            7, // back
            8,
            9,
            10,
            8,
            10,
            11, // top
            12,
            13,
            14,
            12,
            14,
            15, // bottom
            16,
            17,
            18,
            16,
            18,
            19, // right
            20,
            21,
            22,
            20,
            22,
            23, // left
        ];

        this.context.bufferData(
            this.context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices),
            this.context.STATIC_DRAW
        );

        this.buffers = {
            position: positionBuffer!,
            color: colorBuffer!,
            indices: indexBuffer!,
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
            this.cubeRotation * 0.7,
            [1, 1, 1]
        );

        let numComponents = 3;
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

        this.context.bindBuffer(
            this.context.ELEMENT_ARRAY_BUFFER,
            this.buffers!.indices
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

        let vertexCount = 36;
        type = this.context.UNSIGNED_SHORT;
        offset = 0;
        this.context.drawElements(
            this.context.TRIANGLES,
            vertexCount,
            type,
            offset
        );

        offset = 0;
        vertexCount = 4;

        this.context.drawArrays(
            this.context.TRIANGLE_STRIP,
            offset,
            vertexCount
        );

        this.cubeRotation += deltaTime;
    }

    private render(delta: number) {
        const deltaTime = delta * 0.001 - this.previous;
        this.previous = delta * 0.001;

        this.draw(deltaTime);

        requestAnimationFrame(this.render.bind(this));
    }
}
