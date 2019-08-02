export default`
attribute vec4 position;
uniform mat4 u_matrix;
varying vec2 v_texcoord;
void main() {
  gl_Position = u_matrix * position;
  v_texcoord = position.xy * .5 + .5;  // because we know we're using a -1 + 1 quad
}
`