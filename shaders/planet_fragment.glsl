varying vec2 vUv;

void main() {
  // colour is RGBA: u, v, 0, 1
  gl_FragColor = vec4(vec3(vUv, 0.0), 1.0);
}