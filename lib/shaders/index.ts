export * from "./util";

import VertexShaderData from "./vertex.vert?url";
import FragmentShaderData from "./fragment.frag?url";

import { WebGLContext } from "../types";
import { decodeShaderData } from "./util";

export const VertexShader = decodeShaderData(VertexShaderData);
export const FragmentShader = decodeShaderData(FragmentShaderData);

export const loadShader = (
    context: WebGLContext,
    type: number,
    source: string
) => {
    const shader = context.createShader(type);

    if (!shader)
        throw new EvalError(`Could not create shader of type ${type}!`);

    context.shaderSource(shader, source);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        context.deleteShader(shader);
        throw new EvalError(
            `An error occurred compiling the shaders: ${context.getShaderInfoLog(
                shader
            )}`
        );
    }

    return shader;
};

export const initShaders = (context: WebGLContext) => {
    const vertexShader = loadShader(
        context,
        context.VERTEX_SHADER,
        VertexShader
    );

    const fragmentShader = loadShader(
        context,
        context.FRAGMENT_SHADER,
        FragmentShader
    );

    const shaderProgram = context.createProgram();

    if (!shaderProgram) throw new EvalError("Could not create shader program!");

    context.attachShader(shaderProgram, vertexShader);
    context.attachShader(shaderProgram, fragmentShader);
    context.linkProgram(shaderProgram);

    if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS))
        throw new EvalError(
            `Unable to initialize the shader program: ${context.getProgramInfoLog(
                shaderProgram
            )}`
        );

    return shaderProgram;
};
