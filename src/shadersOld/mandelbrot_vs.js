export default`
    attribute vec2 a_position;
    uniform vec2 canvas_resolution;

    varying vec2 pos_color;

    void main(){
        float posX=a_position.x*(canvas_resolution.x / canvas_resolution.y);
        float posY=a_position.y;
        gl_Position=vec4(a_position,0,1);
        pos_color=vec2(posX,posY);
    }
`