/*
// default vertex attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
*/

uniform float altitude;

varying vec2 st;
varying vec3 pos;
varying float elevation;

void main() {
  float intensity = 0.01;

  elevation = 0.0;
  for (float i = 1.0; i < 10.0; i += 1.0) {
    elevation += (1.0 / i) * snoise((intensity / i) * position);
  }

  pos = position + normal * elevation * altitude;

  st = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
