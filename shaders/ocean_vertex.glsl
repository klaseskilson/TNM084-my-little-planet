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
uniform float poleSize;

varying vec3 pos;
varying vec2 st;

const float equator = 0.5;

void main () {
  st = uv;
  // calculate distance to poles [0,1]
  float poleDistance = smoothstep(equator - poleSize, 0.0, abs(equator - st.t));
  // make poles higher than the ocean
  float poleFactor = step(poleSize, poleDistance);
  // stop ocean movement close to poles
  float offset = roughness * snoise(intensity * vec4(position, time * poleFactor));
  pos = position + normal * offset;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
