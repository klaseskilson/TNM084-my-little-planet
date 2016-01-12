uniform float atmosphereAltitude;

varying vec3 norm;
varying vec3 pos;

void main() {
  norm = normal;
  pos = position + normal * atmosphereAltitude;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
