/*
// default vertex attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
*/

uniform float time;

void main () {
  float roughness = 5.0;
  float intensity = 0.1;
  float offset = roughness * snoise(intensity * vec4(position, time));
  vec3 pos = position + normal * offset;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
