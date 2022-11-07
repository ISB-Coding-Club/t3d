use std::f32::consts::PI;
use wasm_bindgen::{JsCast, JsValue, prelude::*};
use web_sys::{HtmlCanvasElement, WebGl2RenderingContext, HtmlElement, Document, window};

use crate::math::{matrix4::Matrix4, vector3::Vector3};
use super::{program::WebGLProgramInfo, buffers::WebGLBuffers};

#[wasm_bindgen]
pub struct WebGLRenderer {
    _root: HtmlElement,
    canvas: Option<HtmlCanvasElement>,
    context: Option<WebGl2RenderingContext>,
    program_info: Option<WebGLProgramInfo>,
    buffers: Option<WebGLBuffers>,
    pub cube_rotation: f32,
    pub previous: f32,
}

#[wasm_bindgen]
impl WebGLRenderer {
    pub async fn new(root: HtmlElement) -> WebGLRenderer {
        return WebGLRenderer {
            _root: root,
            canvas: None,
            context: None,
            program_info: None,
            buffers: None,
            cube_rotation: 0.0,
            previous: 0.0,
        };
    }

    pub async fn init(&mut self) {
        let win = web_sys::window().unwrap();
        let doc: Document = win.document().unwrap();

        let window_height: JsValue = win.inner_height().ok().unwrap();
        let window_width: JsValue = win.inner_width().ok().unwrap();

        let canvas = doc.create_element("canvas").unwrap();
        let canvas: HtmlCanvasElement = canvas.dyn_into::<HtmlCanvasElement>().unwrap();
        
        canvas.set_height(window_height.as_f64().unwrap() as u32);
        canvas.set_width(window_width.as_f64().unwrap() as u32);

        self._root.append_child(&canvas);
        
        let context = canvas
            .get_context("webgl2").ok().unwrap().unwrap()
            .dyn_into::<WebGl2RenderingContext>().unwrap();
        
        let program = WebGLProgramInfo::new(&context);
        let buffers = WebGLBuffers::new();
    }

    pub fn draw(&mut self, delta_time: f32) {
        let context = &self.context.as_ref().unwrap();
        let canvas = &self.canvas.as_ref().unwrap();
        let buffers = &self.buffers.as_ref().unwrap();
        let program_info = &self.program_info.as_ref().unwrap();

        context.clear_color(0.0, 0.0, 0.0, 1.0);
        context.clear_depth(1.0);
        context.enable(WebGl2RenderingContext::DEPTH_TEST);
        context.depth_func(WebGl2RenderingContext::LEQUAL);

        context.clear(
            WebGl2RenderingContext::COLOR_BUFFER_BIT | WebGl2RenderingContext::DEPTH_BUFFER_BIT
        );

        let field_of_view = (45.0 * PI) / 180.0;
        let aspect =
            canvas.client_width() / canvas.client_height();

        let z_near = 0.1;
        let z_far = 100.0;
        let mut projection_matrix = Matrix4::new();

        projection_matrix.perspective(field_of_view, aspect as f32, z_near, z_far);

        let mut model_view_matrix = Matrix4::new();

        &model_view_matrix.translate(model_view_matrix.clone(), Vector3::from(-0.0, 0.0, -6.0));

        &model_view_matrix.rotate(
            model_view_matrix.clone(),
            self.cube_rotation * 0.7,
            Vector3::from(1.0, 1.0, 1.0)
        );

        let mut num_components = 3;
        let mut _type = WebGl2RenderingContext::FLOAT;
        let mut normalize = false;
        let mut stride = 0;
        let mut offset = 0;

        context.bind_buffer(
            WebGl2RenderingContext::ARRAY_BUFFER,
            buffers.get("position")
        );

        context.vertex_attrib_pointer_with_i32(
            program_info.attrib_locations.vertex_position as u32,
            num_components,
            _type,
            normalize,
            stride,
            offset
        );

        context.enable_vertex_attrib_array(
            program_info.attrib_locations.vertex_position as u32
        );

        num_components = 4;
        _type = WebGl2RenderingContext::FLOAT;
        normalize = false;
        stride = 0;
        offset = 0;

        context.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, buffers.get("color"));
        context.vertex_attrib_pointer_with_i32(
            program_info.attrib_locations.vertex_color as u32,
            num_components,
            _type,
            normalize,
            stride,
            offset
        );

        context.enable_vertex_attrib_array(
            program_info.attrib_locations.vertex_color as u32
        );

        context.bind_buffer(
            WebGl2RenderingContext::ELEMENT_ARRAY_BUFFER,
            buffers.get("indices")
        );

        context.use_program(Some(&program_info.program));

        context.uniform_matrix4fv_with_f32_array(
            Some(&program_info.uniform_locations.projection_matrix.clone().unwrap()),
            false,
            &projection_matrix.value
        );

        context.uniform_matrix4fv_with_f32_array(
            Some(&program_info.uniform_locations.model_view_matrix.clone().unwrap()),
            false,
            &model_view_matrix.value
        );

        let mut vertex_count = 36;

        _type = WebGl2RenderingContext::UNSIGNED_SHORT;
        offset = 0;
        
        context.draw_elements_with_i32(
            WebGl2RenderingContext::TRIANGLES,
            vertex_count,
            _type,
            offset
        );

        offset = 0;
        vertex_count = 4;

        context.draw_arrays(
            WebGl2RenderingContext::TRIANGLE_STRIP,
            offset,
            vertex_count
        );

        self.cube_rotation += delta_time;

        // self.canvas = Some(*canvas);
        // self.context = Some(*context);
        // self.buffers = Some(*buffers);
        // self.program_info = Some(*program_info);
    }

    pub fn render(&mut self, delta: f32) {
        let delta_time = delta * 0.001 - self.previous;
        self.previous = delta * 0.001;

        self.draw(delta_time);
    }
}
