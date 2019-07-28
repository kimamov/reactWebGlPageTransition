export default`
    precision mediump float;
    varying vec2 pos_color;


    vec3 hsv2rgb(vec3 c){
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    vec3 didEscape(vec2 myPoint){
        vec3 escaped=vec3(0.0);
        float cReal=myPoint.x;
        float cIm=myPoint.y;
        float realSquared;
        float imSquared;
        for(float i=0.0;i<200.00;i+=1.0){
            realSquared=cReal*cReal - cIm*cIm;
            imSquared=2.0*cReal*cIm;
            cReal=realSquared+myPoint.x;
            cIm=imSquared+myPoint.y;
            if(length(vec2(cReal,cIm))>=2.0){
                return hsv2rgb(vec3(
                    i/100.00, 1.0, 1.0
                ));
            }
        };
        return escaped;
    }

    

    void main(){

        gl_FragColor=vec4(vec3(didEscape(pos_color)),1);
    }
`