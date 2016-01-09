/*
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/

uniform vec3 lightPos;
uniform vec3 cloudColor;
uniform float cloudDensity;

varying vec3 pos;
varying float offset;

void main() {
  float isCloud = step(0.0, offset);
  gl_FragColor = vec4(cloudColor, cloudDensity * isCloud);
}
