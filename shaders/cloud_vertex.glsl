/*
// default vertex attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
*/

uniform float time;
uniform float cloudVariation;
uniform float cloudHeight;
uniform float cloudAnimation;

varying vec3 pos;
varying float offset;

void main() {
  offset = snoise(cloudVariation * vec4(position, time * cloudAnimation));
  pos = position + normal * offset * cloudHeight;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
