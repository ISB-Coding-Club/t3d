use wasm_bindgen::prelude::*;
use std::{sync::Arc, time};

use fyrox::{
    core::{
        algebra::{
            UnitQuaternion,
            Vector3,
        },

        pool::Handle,
    },

    engine::{
        resource_manager::ResourceManager,

        Engine,
        EngineInitParams,
        SerializationContext,
    },
    
    event::{
        DeviceEvent,
        ElementState,
        Event,
        VirtualKeyCode,
        WindowEvent,
    },
    
    event_loop::{
        ControlFlow,
        EventLoop,
    },
    
    resource::texture::TextureWrapMode,
    
    scene::{
        base::BaseBuilder,
        
        camera::{
            CameraBuilder,
            SkyBox,
            SkyBoxBuilder,
        },
        
        collider::{
            ColliderBuilder,
            ColliderShape,
        },
        
        node::Node,

        rigidbody::RigidBodyBuilder,
        
        transform::TransformBuilder,
        
        Scene,
    },
    
    window::WindowBuilder,
};

use crate::utils::set_panic_hook;

pub const TIMESTEP: f32 = 1.0 / 60.0;

#[wasm_bindgen]
pub struct Game {

}

#[wasm_bindgen]
impl Game {
    pub fn new() -> Self {
        return Self {};
    }

    pub fn update(&mut self) {

    }
}

#[wasm_bindgen]
pub fn init_engine() {
    set_panic_hook();

    let window_builder = WindowBuilder::new().with_title("3D Shooter Tutorial");
    // Create event loop that will be used to "listen" events from the OS.
    let event_loop = EventLoop::new();

    // Finally create an instance of the engine.
    let serialization_context = Arc::new(SerializationContext::new());

    let mut engine = Engine::new(EngineInitParams {
            window_builder,
            resource_manager: ResourceManager::new(serialization_context.clone()),
            serialization_context,
            events_loop: &event_loop,
            vsync: false,
        }).unwrap();

    // Initialize game instance. It is empty for now.
    let mut game = Game::new();

    // Run the event loop of the main window. which will respond to OS and window events and update
    // engine's state accordingly. Engine lets you to decide which event should be handled,
    // this is a minimal working example of how it should be.
    let mut previous = time::Instant::now();
    let mut lag = 0.0;

    event_loop.run(move |event, _, control_flow| {
        match event {
            Event::MainEventsCleared => {
                // This main game loop - it has fixed time step which means that game
                // code will run at fixed speed even if renderer can't give you desired
                // 60 fps.
                let elapsed = previous.elapsed();
                previous = time::Instant::now();
                lag += elapsed.as_secs_f32();
                while lag >= TIMESTEP {
                    lag -= TIMESTEP;

                    // Run our game's logic.
                    game.update();

                    // Update engine each frame.
                    engine.update(TIMESTEP, control_flow, &mut lag);
                }

                // Rendering must be explicitly requested and handled after RedrawRequested event is received.
                engine.get_window().request_redraw();
            }

            Event::RedrawRequested(_) => {
                // Render at max speed - it is not tied to the game code.
                engine.render().unwrap();
            }
            
            Event::WindowEvent { event, .. } => match event {
                WindowEvent::CloseRequested => *control_flow = ControlFlow::Exit,
                
                WindowEvent::KeyboardInput { input, .. } => {
                    // Exit game by hitting Escape.
                    if let Some(VirtualKeyCode::Escape) = input.virtual_keycode {
                        *control_flow = ControlFlow::Exit
                    }
                }

                WindowEvent::Resized(size) => {
                    // It is very important to handle Resized event from window, because
                    // renderer knows nothing about window size - it must be notified
                    // directly when window size has changed.
                    engine.set_frame_size(size.into()).unwrap();
                }
                _ => (),
            },

            _ => *control_flow = ControlFlow::Poll,
        }
    });
}
