/*
// default vertex attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
*/

uniform float amplitude;

varying vec2 st;
varying vec3 pos;
varying float elevation;

void main() {
  float intensity = 0.01;

  elevation = snoise(intensity * position);
  elevation += 0.25 * snoise(intensity * position);
  elevation += 0.25 * snoise(8.0 * position);
//  elevation += 0.125 * snoise(16.0 * position);
//  elevation += 0.0625 * snoise(32.0 * position);
//  elevation += 0.03125 * snoise(64.0 * position);
//  elevation += 0.0156 * snoise(128.0 * position);
//  elevation = amplitude * snoise(intensity * position);
  pos = position + normal * elevation * amplitude;

  st = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
