/*
// default vertex attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
*/

uniform float altitude;
uniform float noiseOffset;
uniform float surfaceIntensity;

varying vec3 pos;
varying vec2 st;
varying float elevation;

void main() {
  st = uv;

  // apply noise to elevation
  elevation = 0.0;
  for (float i = 1.0; i < 10.0; i += 1.0) {
    elevation += (1.0 / i) * snoise((surfaceIntensity / i) * position + noiseOffset);
  }
  // apply altitude
  elevation *= altitude;
  // move position along normal
  pos = position + normal * elevation;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
