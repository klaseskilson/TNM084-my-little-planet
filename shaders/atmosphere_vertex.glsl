varying vec3 norm;
varying vec3 pos;

void main() {
  norm = normal;
  pos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
