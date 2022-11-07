use std::collections::HashMap;
use js_sys::{Float32Array, Array, Uint16Array};
use wasm_bindgen::JsValue;
use web_sys::{WebGlBuffer, WebGl2RenderingContext};

pub type WebGLBuffers = HashMap<String, WebGlBuffer>;

pub fn init_buffers(context: WebGl2RenderingContext) -> WebGLBuffers {
    let face_colors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0], // Left face: purple
    ];

    let mut colors: Vec<[f64; 4]> = Vec::new();
    

    for j in 0..face_colors.into_iter().len() {
        let c = face_colors[j];
        // colors.push(c, c, c, c);
        colors.push(c as [f64; 4]);
        colors.push(c as [f64; 4]);
        colors.push(c as [f64; 4]);
        colors.push(c as [f64; 4]);
    }
    
    let color_buffer: WebGlBuffer = context.create_buffer().unwrap();

    context.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&color_buffer));

    let colors_arr: Array = Array::new();

    for val in colors {
        let tmp: Array = Array::new();
        
        tmp.push(&JsValue::from(val[0]));
        tmp.push(&JsValue::from(val[1]));
        tmp.push(&JsValue::from(val[2]));
        tmp.push(&JsValue::from(val[3]));

        colors_arr.push(&tmp);
    }

    let colors_buffer: Float32Array = Float32Array::new(&colors_arr);

    context.buffer_data_with_opt_array_buffer(
        WebGl2RenderingContext::ARRAY_BUFFER,
        Some(&colors_buffer.buffer()),
        WebGl2RenderingContext::STATIC_DRAW
    );
    
    let position_buffer: WebGlBuffer = context.create_buffer().unwrap();
    
    context.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&position_buffer));
    
    let positions = [
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

    let positions_arr: Array = Array::new();

    for val in positions {
        let jsval = JsValue::from(val as f64);
        
        positions_arr.push(&jsval);
    }
    
    let positions_buffer = Float32Array::new(&positions_arr);

    context.buffer_data_with_opt_array_buffer(
        WebGl2RenderingContext::ARRAY_BUFFER,
        Some(&positions_buffer.buffer()),
        WebGl2RenderingContext::STATIC_DRAW
    );
    
    let index_buffer = context.create_buffer().unwrap();
    
    context.bind_buffer(WebGl2RenderingContext::ELEMENT_ARRAY_BUFFER, Some(&index_buffer));
    
    let indices = [
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // back
        8, 9, 10, 8, 10, 11, // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23, // left
    ];

    let indices_arr: Array = Array::new();

    for val in indices {
        let jsval = JsValue::from(val as i32);
        
        indices_arr.push(&jsval);
    }

    let indices_buffer = Uint16Array::new(&indices_arr);

    context.buffer_data_with_opt_array_buffer(
        WebGl2RenderingContext::ELEMENT_ARRAY_BUFFER,
        Some(&indices_buffer.buffer()),
        WebGl2RenderingContext::STATIC_DRAW
    );

    let mut buffers = WebGLBuffers::new();

    buffers.insert(String::from("position"), position_buffer);
    buffers.insert(String::from("color"), color_buffer);
    buffers.insert(String::from("indices"), index_buffer);

    return buffers;
}
