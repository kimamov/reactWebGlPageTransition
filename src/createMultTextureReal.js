/* const main=function(gl, vertexShader, fragmentShader, imageSrcOne, imageSrcTwo) {
    let imageOne = new Image();
    imageOne.src = imageSrcOne;
    imageOne.onload = function() {
      console.log(image.width)
      render(imageOne, imageTwo, gl, vertexShader, fragmentShader);
    };
  } */

  const main=function(gl, vertexShader, fragmentShader, imageArray) {
    let imageOutput=[]
    imageArray.forEach(element=>{
        let image=new Image();
        image.src=element;
        image.onload=()=>{
            imageOutput.push((image))
            if(imageOutput.length===imageArray.length){
                render(imageOutput, gl, vertexShader, fragmentShader);
            }
        }
    })    
  }
  
  function render(images, gl, vertexShader, fragmentShader) {

    // setup GLSL program
    const program = createShaderProgram(gl, vertexShader, fragmentShader);
  
    // look up where the vertex data needs to go.
    let positionLocation = gl.getAttribLocation(program, "a_position");
    let texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
  
    // Create a buffer to put three 2d clip space points in
    let positionBuffer = gl.createBuffer();
  
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set a rectangle the same size as the image
    setRectangle(gl, 0, 0, images[0].width, images[0].height);

    // provide texture coordinates for the rectangle.
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ]), gl.STATIC_DRAW);
  
    // create 2 textures
    var textures = [];
    for (var ii = 0; ii < 2; ++ii) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
  
      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
      // Upload the image into the texture.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[ii]);
  
      // add the texture to the array of textures.
      textures.push(texture);
    }
  
    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  
    // lookup the sampler locations.
    var u_image0Location = gl.getUniformLocation(program, "u_image0");
    var u_image1Location = gl.getUniformLocation(program, "u_image1");
  
  
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
  
    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);
  
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);
  
    // Turn on the teccord attribute
    gl.enableVertexAttribArray(texcoordLocation);
  
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texcoordLocation, size, type, normalize, stride, offset);
  
    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  
    // set which texture units to render with.
    gl.uniform1i(u_image0Location, 0);  // texture unit 0
    gl.uniform1i(u_image1Location, 1);  // texture unit 1
  
    // Set each texture unit to use a particular texture.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[1]);
  
    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  
  function setRectangle(gl, x, y, width, height) {
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       x1, y1,
       x2, y1,
       x1, y2,
       x1, y2,
       x2, y1,
       x2, y2,
    ]), gl.STATIC_DRAW);
  }
  

  const createShaderProgram = (gl, vertexShaderSource, fragmentShaderSource) => {

      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

      const program = createProgram(gl, vertexShader, fragmentShader);

      return program
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


  export default main;
  