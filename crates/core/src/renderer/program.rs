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
    pub fn new(context: &WebGl2RenderingContext, program: &WebGlProgram) -> ProgramAttributeLocations {
        return ProgramAttributeLocations {
            vertex_position: context.get_attrib_location(
                program,
                "aVertexPosition"
            ),

            vertex_color: context.get_attrib_location(
                program,
                "aVertexColor"
            ),
        };
    }
}

impl ProgramUniformLocations {
    pub fn new(context: &WebGl2RenderingContext, program: &WebGlProgram) -> ProgramUniformLocations {
        return ProgramUniformLocations {
            projection_matrix: context.get_uniform_location(
                program,
                "uProjectionMatrix"
            ),
            model_view_matrix: context.get_uniform_location(
                program,
                "uModelViewMatrix"
            ),
        }
    }
}

impl WebGLProgramInfo {
    pub fn new(context: &WebGl2RenderingContext) -> WebGLProgramInfo {
        let program = init_shaders(&context);

        let attrib_locations = ProgramAttributeLocations::new(&context, &program);
        let uniform_locations = ProgramUniformLocations::new(&context, &program);

        return WebGLProgramInfo {
            program,

            attrib_locations,
            uniform_locations,
        };
    }
}
