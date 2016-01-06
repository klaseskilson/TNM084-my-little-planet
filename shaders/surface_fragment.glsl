/*
// default fragment attributes
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/

uniform float amplitude;
uniform vec3 lightPos;

varying vec2 st;
varying vec3 pos;
varying float elevation;

vec3 smth (vec3 a, vec3 b, float m) {
  return a + vec3(m) * (b - a);
}

void main () {
  float forest = 0.3 + 0.2 * cnoise(pos * 0.5);
  vec3 groundColor = vec3(0.0, forest, 0.0);
  vec3 sandColor = vec3(0.75, 0.68, 0.39);
  vec3 rockColor = vec3(0.3, 0.3, 0.3);
  vec3 snowColor = vec3(1.0, 1.0, 1.0);

  // interpolation distance between biomes
  float itpr = 0.02;
  // the biomes' altitude ranges
  vec2 sandR = vec2(-2.0, 0.1); // * amplitude;
  vec2 groundR = vec2(0.1, 0.6); // * amplitude;
  vec2 rockR = vec2(0.6, 0.8); // * amplitude;
  vec2 snowR = vec2(0.8, 2.0); // * amplitude;

  // interpolate between biomes
  float sand = smoothstep(sandR.x - itpr, sandR.x, elevation)
        - smoothstep(sandR.y - itpr, sandR.y, elevation);
  float ground = smoothstep(groundR.x - itpr, groundR.x, elevation)
        - smoothstep(groundR.y - itpr, groundR.y, elevation);
  float rock = smoothstep(rockR.x - itpr, rockR.x, elevation)
        - smoothstep(rockR.y - itpr, rockR.y, elevation);
  float snow = smoothstep(snowR.x - itpr, snowR.x, elevation)
        - smoothstep(snowR.y - itpr, snowR.y, elevation);

  // apply interpolation, mix colors
  vec3 clr = vec3(0.0);
  clr = mix(clr, sandColor, sand);
  clr = mix(clr, groundColor, ground);
  clr = mix(clr, rockColor, rock);
  clr = mix(clr, snowColor, snow);

  gl_FragColor = vec4(clr, 1.0);
}
