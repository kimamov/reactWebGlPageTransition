export default`
precision mediump float;
varying vec2 v_texCoord;
uniform float u_scrollVal;
uniform sampler2D u_tex;
uniform sampler2D u_image0;
uniform sampler2D u_image1;

void main() {
  vec4 color0 = texture2D(u_image0, v_texCoord);
  vec4 color1 = texture2D(u_image1, v_texCoord);
  gl_FragColor = mix(color0, color1, (v_texCoord.x*v_texCoord.y/2.0)>u_scrollVal? 1.0 : 0.0);
  //gl_FragColor = vec4(v_texCoord.y,v_texCoord.y,v_texCoord.y,1.0);


}
`