/*
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/

uniform vec3 lightPos;

varying vec3 pos;
varying vec3 norm;

void main () {
  // light intensity params
  float ka = 0.0;
  float kd = 10.0;
  float ks = 1.0;
  float alpha = 10.0;

  // light vectors
  vec3 l = normalize(lightPos - pos);
  vec3 v = normalize(cameraPosition - pos);
  vec3 r = normalize(2.0 * dot(l, norm) * norm - l);

  // light colors
  vec3 aLight = vec3(1.0);
  vec3 dLight = vec3(1.0);
  vec3 sLight = vec3(1.0);

  // ocean color
  vec3 ocean = vec3(0.0, 0.02, 1.0);

  // calculate intensity
  vec3 phong = ka * aLight
    + kd * dot(l, norm) * dLight
    + ks * pow(dot(r, v), alpha) * sLight;

  gl_FragColor = vec4(ocean * phong, 0.8);
}
