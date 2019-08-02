export default`
attribute vec4 position;
uniform mat4 u_matrix;
varying vec2 v_texCoord;

void main() {
  gl_Position = u_matrix * position;
  v_texCoord = position.xy * .5 + .5;  // because we know we're using a -1 + 1 quad
}
`