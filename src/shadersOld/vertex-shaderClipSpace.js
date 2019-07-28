export default`
    attribute vec2 a_position;
    uniform vec2 u_resolution;


    void main(){
        vec2 adjustResolution=vec2(a_position/u_resolution);
        vec2 scaleTwo=adjustResolution*2.0;
        vec2 clipSpace=scaleTwo-1.0;
        gl_Position=vec4(clipSpace,0,1);
    }
`