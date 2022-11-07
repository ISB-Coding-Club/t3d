#![allow(unsafe_code, unused, array_into_iter)]

pub mod utils;
pub mod math;
pub mod linker;
pub mod shader;
pub mod webgl;
pub mod renderer;
pub mod wgpu;

use renderer::webgl::WebGLRenderer;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::HtmlElement;
use web_sys::WebGl2RenderingContext;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn start() -> Result<(), JsValue> {
    

    return Ok(());
}
