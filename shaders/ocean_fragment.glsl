/*
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/

uniform vec3 lightPos;
uniform float time;
uniform float roughness;
uniform float intensity;

varying vec3 pos;
varying vec3 originalPos;
varying vec3 norm;

float clampDot(vec3 a, vec3 b) {
  return clamp(dot(a, b), 0.0, 1.0);
}

void main () {
  // light intensity params
  float ka = 0.1;
  float kd = 1.0;
  float ks = 1.0;
  float shinyness = 10.0;

  /*// find new normal for current point
  vec4 posTime = vec4(originalPos, time);
  // create offset points
  float delta = 0.001;
  vec3 deltaX = norm * vec3(delta, 0.0, 0.0);
  vec3 deltaY = norm * vec3(0.0, delta, 0.0);
  vec4 px = posTime + vec4(deltaX, 0.0);
  vec4 py = posTime + vec4(deltaY, 0.0);
  // calculate noise in offset positions
  float offsetX = roughness * snoise(intensity * px);
  float offsetY = roughness * snoise(intensity * py);
  vec3 newX = px.xyz + (norm + deltaX) * offsetX;
  vec3 newY = py.xyz + (norm + deltaY) * offsetY;
  // calculate normal
  vec3 dx = normalize(newX - pos);
  vec3 dy = normalize(newY - pos);*/
  vec3 dx = dFdx(pos);
  vec3 dy = dFdy(pos);
  vec3 newNormal = normalize(cross(dx, dy));

  // light vectors
  vec3 l = normalize(lightPos - pos);
  vec3 v = normalize(cameraPosition - pos);
  vec3 r = - reflect(l, newNormal);

  // ocean color
  vec3 ocean = vec3(0.0, 0.0, 1.0);

  // light colors
  vec3 aLight = ocean;
  vec3 dLight = ocean;
  vec3 sLight = vec3(1.0);

  // calculate intensity
  vec3 phong = ka * aLight
    + kd * clampDot(l, newNormal) * dLight
    + ks * pow(clampDot(r, v), shinyness) * sLight;

  gl_FragColor = vec4(phong, 0.8);
}
