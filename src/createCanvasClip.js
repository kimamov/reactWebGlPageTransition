


const createCanvas=function(gl, vertexShader, fragmentShader) {
    const program = createShaderProgram(gl, vertexShader, fragmentShader);
    drawShader(gl, program, 2)

}
const createShaderProgram = (gl, vertexShaderSource, fragmentShaderSource) => {

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    const program = createProgram(gl, vertexShader, fragmentShader);

    return program
}

const drawShader = (gl, program, dimension) => {

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);



    // draw 2 triangles creating a square
    const positions = [
        -1, -1,
        -1, 1,
        1, 1,
        1, -1,
        1, 1,
        -1, -1
    ];

/*     const positions = [
        0, 0,
        0, 600,
        800, 600,
        800, 0,
        800, 600,
        0, 0
    ];
     */
/*     const positions = [
        200, 200,
        200, 400,
        400, 400,
        400, 200,
        400, 400,
        200, 200
    ]; */
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    // set custom uniform offset
    
    const canvasResolution=gl.getUniformLocation(program, "u_resolution");
    const zoomCenter=gl.getUniformLocation(program, 'u_zoomCenter');
    const zoomValue=gl.getUniformLocation(program, 'u_zoomSize');
    const maxIteration=gl.getUniformLocation(program,'u_maxIterations');

    gl.uniform2f(canvasResolution, gl.canvas.clientWidth, gl.canvas.clientHeight);
    gl.uniform2f(zoomCenter,-1.0,0.0);
    gl.uniform1f(zoomValue,2.0);
    gl.uniform1i(maxIteration,100);

    gl.enableVertexAttribArray(positionAttributeLocation);


    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)


    const primitiveType = gl.TRIANGLES;
    offset = 0;
    const count = positions.length / dimension;
    gl.drawArrays(primitiveType, offset, count);
}



const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const succes = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (succes) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export default createCanvas;