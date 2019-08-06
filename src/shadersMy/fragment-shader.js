export default`
precision mediump float;
varying vec2 v_texCoord;
uniform float u_scrollVal;
uniform sampler2D u_tex;
uniform sampler2D u_image0;
uniform sampler2D u_image1;


float texTransition(vec2 pos, float limit, float delay){


 
  float posDistance=limit-((pos.x+pos.y)/(2.0+2.0*delay));


  if(posDistance<=0.0){
    return 0.0;
  }
  if(posDistance>delay){
    return 1.0;
  }
  if(posDistance>0.0){
    return abs(posDistance/delay);
  }
}


void main() {

  // when the texture repeats flip it to make the transition look more smooth
  float texOneModY=v_texCoord.y+u_scrollVal>1.0?1.0 - mod(v_texCoord.y+(u_scrollVal),1.0) : mod(v_texCoord.y+(u_scrollVal),1.0);
  // texture 2 starts flipped and gets flipped back on scroll
  float texTwoModY=v_texCoord.y+u_scrollVal<1.0?1.0 - mod(v_texCoord.y+(u_scrollVal),1.0) : mod(v_texCoord.y+(u_scrollVal),1.0);



  
  vec4 color0 = texture2D(u_image0, vec2(v_texCoord.x, texOneModY));
  vec4 color1 = texture2D(u_image1, vec2(v_texCoord.x, texTwoModY));



  //gl_FragColor = mix(color0, color1, ((v_texCoord.x+v_texCoord.y)/2.0)>u_scrollVal? 1.0 : 0.0);
  //gl_FragColor = mix(color0, color1, ((v_texCoord.x+v_texCoord.y)/2.0)-u_scrollVal);
  
  /* vec4 red=vec4(1.0,0.0,0.0,1.0);
  vec4 green=vec4(0.0,1.0,0.0,1.0); */


  gl_FragColor = mix(color0, color1, texTransition(v_texCoord, u_scrollVal, 0.2));
  //gl_FragColor = mix(red, green, texTransition(v_texCoord, u_scrollVal, 0.2));


}
`