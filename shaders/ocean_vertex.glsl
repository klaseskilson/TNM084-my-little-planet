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
uniform float oceanLevel;

varying vec3 pos;

void main () {
  float offset = roughness * snoise(intensity * vec4(position, time));
  pos = position + normal * (offset + oceanLevel);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
