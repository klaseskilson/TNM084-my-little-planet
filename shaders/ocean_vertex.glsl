/*
// default vertex attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
*/

uniform float time;
uniform float roughness;

varying vec3 pos;
varying vec3 norm;

void main () {
  float intensity = 0.1;
  float offset = roughness * snoise(intensity * vec4(position, time));
  pos = position + normal * offset;
  norm = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
