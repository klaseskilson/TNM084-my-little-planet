#ifdef GL_ES
  precision highp float;
#endif

/*
// default vertex attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
*/

varying vec2 vUv;

void main() {
  float intensity = 20.0;
  vec3 offset = normal * intensity * snoise(0.3 * position);
  vec3 pos = position + offset;

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
