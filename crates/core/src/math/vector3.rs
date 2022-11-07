pub struct Vector3 {
    pub value: [f32; 3],
}

impl Vector3 {
    pub fn from(x: f32, y: f32, z: f32) -> Vector3 {
        return Vector3 {
            value: [x, y, z],
        };
    }
}
