export type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

export interface WebGLProgramInfo {
    program: WebGLProgram;

    attribLocations: {
        vertexPosition: number;
        vertexColor: number;
    };

    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null;
        modelViewMatrix: WebGLUniformLocation | null;
    };
}

export type WebGLBuffers = { [key: string]: WebGLBuffer };

export const decodeDataURI = (uri: string) => {
    return atob(uri.split(";base64,")[1]);
};
