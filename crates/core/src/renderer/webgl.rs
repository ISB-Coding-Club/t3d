use wasm_bindgen::{JsCast, JsValue};
use web_sys::{HtmlCanvasElement, WebGl2RenderingContext, HtmlElement, window, Document, Element};
use super::{program::WebGLProgramInfo, buffers::WebGLBuffers};

pub struct WebGLRenderer {
    pub canvas: HtmlCanvasElement,
    pub context: WebGl2RenderingContext,
    pub program_info: WebGLProgramInfo,
    pub buffers: WebGLBuffers,
    pub cube_rotation: isize,
    pub previous: isize,
}

impl WebGLRenderer {
    pub fn new(root: HtmlElement) -> &WebGLRenderer {
        unsafe {
            let win = web_sys::window().unwrap();
            let doc: Document = win.document().unwrap();

            let canvas = doc.create_element("canvas").unwrap();
            let canvas: HtmlCanvasElement = canvas.dyn_into::<HtmlCanvasElement>().unwrap();

            let window_height: JsValue = win.inner_height().ok().unwrap();
            let window_width: JsValue = win.inner_width().ok().unwrap();

            canvas.set_height(window_height.as_f64().unwrap() as u32);
            canvas.set_width(window_width.as_f64().unwrap() as u32);

            root.append_child(&canvas);

            let context = canvas
                .get_context("webgl2").ok().unwrap().unwrap()
                .dyn_into::<WebGl2RenderingContext>().unwrap();

            return WebGLRenderer {
                canvas,
                context,
            };
        }
    }
}
