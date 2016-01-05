/*
// default fragment attributes
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/

varying vec2 vUv;
varying vec3 pos;
varying float elevation;

vec3 smth (vec3 a, vec3 b, float m) {
  return a + vec3(m) * (b - a);
}

void main () {
  float forest = 0.3 + 0.2 * cnoise(pos * 0.5);
  vec3 green = vec3(0.0, forest, 0.0);

  // mix colors
  vec3 clr = vec3(0.0);
  clr += smth(green, green, 0.0);

  gl_FragColor = vec4(clr, 1.0);
}
