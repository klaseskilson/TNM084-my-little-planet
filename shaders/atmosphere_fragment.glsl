uniform vec3 lightPos;
uniform vec3 atmosphereColor;
uniform float atmosphereOpacity;

varying vec3 norm;
varying vec3 pos;

float clampDot(vec3 a, vec3 b) {
  return clamp(dot(a, b), 0.0, 1.0);
}

void main() {
  // light intensity params
  float ka = 0.05;
  float kd = 1.0;
  float ks = 1.0;
  float shinyness = 10.0;

  // light vectors
  vec3 l = normalize(lightPos - pos);
  vec3 v = normalize(cameraPosition - pos);
  vec3 r = - reflect(l, norm);

  vec3 aLight = atmosphereColor;
  vec3 dLight = vec3(1.0);
  vec3 sLight = atmosphereColor;

  vec3 phong = ka * aLight
    + kd * clampDot(l, norm) * dLight
    + ks * pow(clampDot(r, v), shinyness) * sLight;

  gl_FragColor = vec4(phong, atmosphereOpacity);
}
