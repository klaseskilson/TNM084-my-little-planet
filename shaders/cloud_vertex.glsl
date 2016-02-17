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
  // interpolatedNormal = normalize(vec3(transpose(inverse(MV)) * vec4(inNormal, 1.0)));
  offset = snoise(cloudVariation * vec4(position, time * cloudAnimation));
  pos = position + normal * offset * cloudHeight;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
