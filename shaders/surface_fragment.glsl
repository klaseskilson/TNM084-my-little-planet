/*
// default fragment attributes
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/

uniform vec3 lightPos;
uniform float poleSize;

varying vec3 pos;
varying float elevation;
varying vec2 st;

const float equator = 0.5;

vec3 smth (vec3 a, vec3 b, float m) {
  return a + vec3(m) * (b - a);
}

void main () {
  // calculate distance to poles [0,1]
  float poleDistance = smoothstep(equator - poleSize, 0.0, abs(equator - st.t));
  poleDistance += (poleSize / 2.0) * cnoise(pos);
  // make poles higher than the ocean
  float isPole = step(poleDistance, poleSize);
  float notPole = step(poleSize, poleDistance);

  float offset = cnoise(pos);
  vec3 groundColor = vec3(0.0, 0.3, 0.0);
  groundColor.g += 0.2 * cnoise(pos * 0.5);
  vec3 sandColor = vec3(0.75, 0.68, 0.39);
  sandColor *= 1.0 - (0.2 * offset);
  vec3 rockColor = vec3(0.3, 0.3, 0.3);
  rockColor *= 1.0 - (0.2 * offset);
  vec3 bottomColor = rockColor;
  vec3 snowColor = vec3(1.0, 1.0, 1.0);
  snowColor *= 1.0 - (0.1 * offset);

  // interpolation distance between biomes
  float itpr = 0.1;
  // the biomes' altitude ranges
  vec2 sandR = vec2(-0.5, 0.1);
  vec2 groundR = vec2(0.1, 0.6);
  vec2 rockR = vec2(0.6, 0.8);
  vec2 snowR = vec2(0.8, 2.0);

  // interpolate between biomes
  // the sand works a bit differently, as it goes from the bottom
  // of the ocean to the beach.
  float sand = smoothstep(sandR.x, sandR.y, elevation);
  float ground = smoothstep(groundR.x - itpr, groundR.x, elevation)
        - smoothstep(groundR.y - itpr, groundR.y, elevation);
  float rock = smoothstep(rockR.x - itpr, rockR.x, elevation)
        - smoothstep(rockR.y - itpr, rockR.y, elevation);
  float snow = smoothstep(snowR.x - itpr, snowR.x, elevation)
        - smoothstep(snowR.y - itpr, snowR.y, elevation);

  // apply pole exceptions
  sand *= notPole;
  ground *= notPole;
  rock *= notPole;
  snow += isPole * 1.0;

  // apply interpolation, mix colors
  vec3 clr = bottomColor;
  clr = mix(clr, sandColor, sand);
  clr = mix(clr, groundColor, ground);
  clr = mix(clr, rockColor, rock);
  clr = mix(clr, snowColor, snow);

  float ka = 0.01;
  float kd = 1.0;

  // find new normal for current point
  vec3 dx = dFdx(pos);
  vec3 dy = dFdy(pos);
  vec3 newNormal = normalize(cross(dx, dy));

  vec3 l = normalize(lightPos - pos);

  // apply diffuse phong
  clr *= kd * dot(l, newNormal);

  gl_FragColor = vec4(clr, 1.0);
}
