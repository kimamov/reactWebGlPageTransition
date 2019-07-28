export default`
    attribute vec2 a_position;
    varying vec2 clipSpace;
    uniform vec2 u_resolution;

    float aspectRatio=u_resolution.x/u_resolution.y;

    void main(){
        gl_Position=vec4(a_position,1,1);
        clipSpace=vec2(a_position.x, a_position.y/aspectRatio)*2.0;
    }
`