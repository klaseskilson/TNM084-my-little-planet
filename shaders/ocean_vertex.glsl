/*
// default vertex attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
*/

uniform float time;
uniform float roughness;
uniform float intensity;

varying vec3 pos;
varying vec3 originalPos;
varying vec3 norm;

void main () {
  originalPos = position;
  float offset = roughness * snoise(intensity * vec4(position, time));
  pos = position + normal * offset;
  norm = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
