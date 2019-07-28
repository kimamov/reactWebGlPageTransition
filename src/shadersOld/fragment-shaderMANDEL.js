export default`
precision mediump float;

uniform vec2 u_resolution;

uniform vec2 u_zoomCenter;

uniform float u_zoomSize;

uniform int u_maxIterations;

vec2 f(vec2 z, vec2 c) {
    return vec2(z.x*z.x - z.y*z.y, z.x*z.y*2.0)+c;
}

void main() {
  // adjust for resolution
  //vec2 uv=gl_FragCoord.xy / u_resolution;
  vec2 uv=gl_FragCoord.xy / vec2(u_resolution.x);
  //vec2 uv=gl_FragCoord.xy;
  vec2 c = u_zoomCenter + (uv * 4.0 - vec2(2.0)) * (u_zoomSize / 4.0);
  //vec2 c = u_zoomCenter + (uv) * (u_zoomSize);
  vec2 z = vec2(0.0);
  bool escaped = false;
  for (int i = 0; i < 10000; i++) {
    /* Unfortunately, GLES 2 doesn't allow non-constant expressions in loop
       conditions so we have to do this ugly thing instead. */
    if (i > u_maxIterations) break;
    z = f(z, c);
    if (length(z) > 2.0) {
      escaped = true;
      break;
    }
  }
  gl_FragColor = escaped ? vec4(1.0) : vec4(vec3(0.0), 1.0);

}
`