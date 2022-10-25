use web_sys::{WebGlProgram, WebGl2RenderingContext, WebGlShader};

pub const vertex: &str = r##"
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
}
"##;

pub const fragment: &str = r##"
varying lowp vec4 vColor;
    
void main(void) {
    gl_FragColor = vColor;
}
"##;

pub fn load_shader(
    context: WebGl2RenderingContext,
    shader_type: u32,
    source: &str
) -> WebGlShader {
    let shader = context.create_shader(shader_type).unwrap();

    context.shader_source(&shader, source);
    context.compile_shader(&shader);

    if !context.get_shader_parameter(&shader, WebGl2RenderingContext::COMPILE_STATUS) {
        context.delete_shader(Some(&shader));
    }

    return shader;
}

pub fn init_shaders(context: WebGl2RenderingContext) -> WebGlProgram {
    let vertex_shader = load_shader(
        context,
        WebGl2RenderingContext::VERTEX_SHADER,
        vertex
    );

    let fragment_shader = load_shader(
        context,
        WebGl2RenderingContext::FRAGMENT_SHADER,
        fragment
    );

    let shader_program = context.create_program().unwrap();

    context.attach_shader(&shader_program, &vertex_shader);
    context.attach_shader(&shader_program, &fragment_shader);
    context.link_program(&shader_program);

    return shader_program;
}
