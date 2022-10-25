use web_sys::{WebGlProgram, WebGlUniformLocation, WebGl2RenderingContext};

use super::shaders::init_shaders;

pub struct WebGLProgramInfo {
    pub program: WebGlProgram,
    pub attrib_locations: ProgramAttributeLocations,
    pub uniform_locations: ProgramUniformLocations,
}

pub struct ProgramAttributeLocations {
    pub vertex_position: i32,
    pub vertex_color: i32,
}

pub struct ProgramUniformLocations {
    pub projection_matrix: Option<WebGlUniformLocation>,
    pub model_view_matrix: Option<WebGlUniformLocation>,
}

impl ProgramAttributeLocations {
    pub fn new(context: WebGl2RenderingContext, program: WebGlProgram) -> ProgramAttributeLocations {
        return ProgramAttributeLocations {
            vertex_position: context.get_attrib_location(
                &program,
                "aVertexPosition"
            ),

            vertex_color: context.get_attrib_location(
                &program,
                "aVertexColor"
            ),
        };
    }
}

impl WebGLProgramInfo {
    pub fn new(context: WebGl2RenderingContext) -> WebGLProgramInfo {
        let program = init_shaders(context);

        return WebGLProgramInfo {
            program,

            // attribLocations: {
            //     vertexPosition: this.context.getAttribLocation(
            //         shaderProgram,
            //         "aVertexPosition"
            //     ),

            //     vertexColor: this.context.getAttribLocation(
            //         shaderProgram,
            //         "aVertexColor"
            //     ),
            // },

            // uniformLocations: {
            //     projectionMatrix: this.context.getUniformLocation(
            //         shaderProgram,
            //         "uProjectionMatrix"
            //     ),
            //     modelViewMatrix: this.context.getUniformLocation(
            //         shaderProgram,
            //         "uModelViewMatrix"
            //     ),
            // },
        };
    }
}
