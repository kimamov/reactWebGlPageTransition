export default`
precision mediump float;

vec2 u_resolution;

uniform vec2 u_zoomCenter;

varying vec2 clipSpace;

uniform float u_zoomSize;

uniform int u_maxIterations;

vec2 f(vec2 z, vec2 c) {
  return vec2(z.x*z.x - z.y*z.y, z.x*z.y*2.0)+c;
}

vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main() {
  vec2 uv=clipSpace;
  //vec2 c = u_zoomCenter + (uv * 4.0 - vec2(2.0)) * (u_zoomSize / 4.0);
  //vec2 c = u_zoomCenter + (uv) * (u_zoomSize);

  vec2 c = uv;
  vec2 z = vec2(0.0);
  bool escaped = false;
  float escapedAt=0.0;
  for (float i=0.0;i<1.0;i+=0.005) {
    z = f(z, c);
    if (length(z) > 2.0) {
      //gl_FragColor =vec4(vec2(i),1.0,1.0);
      escaped = true;
      escapedAt=i;
      break;
    }
  }
  //gl_FragColor = escaped ? vec4(vec2(escapedIteration),0,1) : vec4(vec3(0.0), 1.0);
  //gl_FragColor =vec4(vec2(escapedIteration),0,1);
  gl_FragColor =escaped? vec4(vec3(hsv2rgb(vec3(escapedAt,1.0,1.0))),1.0) : vec4(vec3(0.0), 1.0);

}
`