use std::f32::INFINITY;

use super::vector3::Vector3;

pub struct Matrix4 {
    pub value: [f32; 16],
}

impl Matrix4 {
    pub fn new() -> Matrix4 {
        let mut arr: [f32; 16] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

        arr[0] = 1.0;
        arr[1] = 0.0;
        arr[2] = 0.0;
        arr[3] = 0.0;
        arr[4] = 0.0;
        arr[5] = 1.0;
        arr[6] = 0.0;
        arr[7] = 0.0;
        arr[8] = 0.0;
        arr[9] = 0.0;
        arr[10] = 1.0;
        arr[11] = 0.0;
        arr[12] = 0.0;
        arr[13] = 0.0;
        arr[14] = 0.0;
        arr[15] = 1.0;

        return Matrix4 { value: arr };
    }

    pub fn copy(&mut self, out: &mut Matrix4) {
        out.value[0] = self.value[0];
        out.value[1] = self.value[1];
        out.value[2] = self.value[2];
        out.value[3] = self.value[3];
        out.value[4] = self.value[4];
        out.value[5] = self.value[5];
        out.value[6] = self.value[6];
        out.value[7] = self.value[7];
        out.value[8] = self.value[8];
        out.value[9] = self.value[9];
        out.value[10] = self.value[10];
        out.value[11] = self.value[11];
        out.value[12] = self.value[12];
        out.value[13] = self.value[13];
        out.value[14] = self.value[14];
        out.value[15] = self.value[15];
    }

    pub fn perspective(&mut self, fovy: f32, aspect: f32, near: f32, far: f32) {
        let f = 1.0 / (fovy / 2.0).tan();

        self.value[0] = f / aspect;
        self.value[1] = 0.0;
        self.value[2] = 0.0;
        self.value[3] = 0.0;
        self.value[4] = 0.0;
        self.value[5] = f;
        self.value[6] = 0.0;
        self.value[7] = 0.0;
        self.value[8] = 0.0;
        self.value[9] = 0.0;
        self.value[11] = -1.0;
        self.value[12] = 0.0;
        self.value[13] = 0.0;
        self.value[15] = 0.0;

        if far != INFINITY {
          let nf = 1.0 / (near - far);

          self.value[10] = (far + near) * nf;
          self.value[14] = 2.0 * far * near * nf;
        } else {
          self.value[10] = -1.0;
          self.value[14] = -2.0 * near;
        }
    }

    pub fn translate(&mut self, a: Matrix4, v: Vector3) {
        let x = v.value[0];
        let y = v.value[1];
        let z = v.value[2];

        let a00: f32; let a01: f32; let a02: f32; let a03: f32;
        let a10: f32; let a11: f32; let a12: f32; let a13: f32;
        let a20: f32; let a21: f32; let a22: f32; let a23: f32;

        if a.value == self.value {
            self.value[12] = a.value[0] * x + a.value[4] * y + a.value[8] * z + a.value[12];
            self.value[13] = a.value[1] * x + a.value[5] * y + a.value[9] * z + a.value[13];
            self.value[14] = a.value[2] * x + a.value[6] * y + a.value[10] * z + a.value[14];
            self.value[15] = a.value[3] * x + a.value[7] * y + a.value[11] * z + a.value[15];
        } else {
            a00 = a.value[0];
            a01 = a.value[1];
            a02 = a.value[2];
            a03 = a.value[3];
            a10 = a.value[4];
            a11 = a.value[5];
            a12 = a.value[6];
            a13 = a.value[7];
            a20 = a.value[8];
            a21 = a.value[9];
            a22 = a.value[10];
            a23 = a.value[11];
            
            self.value[0] = a00;
            self.value[1] = a01;
            self.value[2] = a02;
            self.value[3] = a03;
            self.value[4] = a10;
            self.value[5] = a11;
            self.value[6] = a12;
            self.value[7] = a13;
            self.value[8] = a20;
            self.value[9] = a21;
            self.value[10] = a22;
            self.value[11] = a23;
            
            self.value[12] = a00 * x + a10 * y + a20 * z + a.value[12];
            self.value[13] = a01 * x + a11 * y + a21 * z + a.value[13];
            self.value[14] = a02 * x + a12 * y + a22 * z + a.value[14];
            self.value[15] = a03 * x + a13 * y + a23 * z + a.value[15];
        }
    }

    pub fn rotate(&mut self, a: Matrix4, rad: f32, axis: Vector3) {
        let mut x = axis.value[0];
        let mut y = axis.value[1];
        let mut z = axis.value[2];
  
        let mut len = (x * x + y * y + z * z).sqrt();

        let s; let c; let t;
        
        let a00: f32; let a01: f32; let a02: f32; let a03: f32;
        let a10: f32; let a11: f32; let a12: f32; let a13: f32;
        let a20: f32; let a21: f32; let a22: f32; let a23: f32;
        let b00: f32; let b01: f32; let b02: f32;
        let b10: f32; let b11: f32; let b12: f32;
        let b20: f32; let b21: f32; let b22: f32;

  if (len < 0.000001) {
    return;
  }

  len = 1.0 / len;
  x *= len;
  y *= len;
  z *= len;

  s = rad.sin();
  c = rad.cos();
  t = 1.0 - c;

  a00 = a.value[0];
  a01 = a.value[1];
  a02 = a.value[2];
  a03 = a.value[3];
  a10 = a.value[4];
  a11 = a.value[5];
  a12 = a.value[6];
  a13 = a.value[7];
  a20 = a.value[8];
  a21 = a.value[9];
  a22 = a.value[10];
  a23 = a.value[11];

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;

  // Perform rotation-specific matrix multiplication
  self.value[0] = a00 * b00 + a10 * b01 + a20 * b02;
  self.value[1] = a01 * b00 + a11 * b01 + a21 * b02;
  self.value[2] = a02 * b00 + a12 * b01 + a22 * b02;
  self.value[3] = a03 * b00 + a13 * b01 + a23 * b02;
  self.value[4] = a00 * b10 + a10 * b11 + a20 * b12;
  self.value[5] = a01 * b10 + a11 * b11 + a21 * b12;
  self.value[6] = a02 * b10 + a12 * b11 + a22 * b12;
  self.value[7] = a03 * b10 + a13 * b11 + a23 * b12;
  self.value[8] = a00 * b20 + a10 * b21 + a20 * b22;
  self.value[9] = a01 * b20 + a11 * b21 + a21 * b22;
  self.value[10] = a02 * b20 + a12 * b21 + a22 * b22;
  self.value[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a.value != self.value) {
    // If the source and destination differ, copy the unchanged last row
    self.value[12] = a.value[12];
    self.value[13] = a.value[13];
    self.value[14] = a.value[14];
    self.value[15] = a.value[15];
  }
    }
}

impl Clone for Matrix4 {
    fn clone(&self) -> Matrix4 {
        let mut arr: [f32; 16] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

        arr[0] = self.value[0];
        arr[1] = self.value[1];
        arr[2] = self.value[2];
        arr[3] = self.value[3];
        arr[4] = self.value[4];
        arr[5] = self.value[5];
        arr[6] = self.value[6];
        arr[7] = self.value[7];
        arr[8] = self.value[8];
        arr[9] = self.value[9];
        arr[10] = self.value[10];
        arr[11] = self.value[11];
        arr[12] = self.value[12];
        arr[13] = self.value[13];
        arr[14] = self.value[14];
        arr[15] = self.value[15];

        return Matrix4 { value: arr };
    }
}
