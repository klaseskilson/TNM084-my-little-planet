/*
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/

uniform vec3 lightPos;
uniform vec3 cloudColor;
uniform float cloudDensity;
uniform float cloudLimit;

varying vec3 pos;
varying float offset;

float clampDot(vec3 a, vec3 b) {
  return clamp(dot(a, b), 0.0, 1.0);
}

void main() {
  // light intensity params
  float ka = 0.05;
  float kd = 1.0;
  float ks = 1.0;
  float shinyness = 20.0;

  // find new normal for current point
  vec3 dx = dFdx(pos);
  vec3 dy = dFdy(pos);
  vec3 newNormal = normalize(cross(dx, dy));

  // light vectors
  vec3 l = normalize(lightPos - pos);
  vec3 v = normalize(cameraPosition - pos);
  vec3 r = - reflect(l, newNormal);

  // light colors
  vec3 dLight = cloudColor;
  vec3 aLight = dLight;
  vec3 sLight = vec3(1.0);

  // calculate intensity
  vec3 phong = ka * aLight
    + kd * clampDot(l, newNormal) * dLight
    + ks * pow(clampDot(r, v), shinyness) * sLight;

  float isCloud = step(cloudLimit, offset);

  gl_FragColor = vec4(phong, cloudDensity * isCloud);
}
