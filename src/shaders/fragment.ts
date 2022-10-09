export const FragmentShader = `
    varying lowp vec4 vColor;
    
    void main(void) {
      gl_FragColor = vColor;
    }
`;
