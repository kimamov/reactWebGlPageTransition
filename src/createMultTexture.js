
  const main=function(gl, vertexShader, fragmentShader, imageArray, scrollRef) {
    let imageOutput=[]
    imageArray.forEach(element=>{
        let image=new Image();
        image.src=element;
        image.onload=()=>{
            imageOutput.push((image))
            if(imageOutput.length===imageArray.length){
                render(imageOutput, scrollRef, gl, vertexShader, fragmentShader);
            }
        }
    })    
  }
  
  function render(images, scrollRef, gl, vertexShader, fragmentShader) {
    

    // setup GLSL program
    const program = createShaderProgram(gl, vertexShader, fragmentShader);
  
    // look up where the vertex data needs to go.
    let positionLocation = gl.getAttribLocation(program, "position");
  
    // Create a buffer to put three 2d clip space points in
    let positionBuffer = gl.createBuffer();
  
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set a rectangle the same size as the image
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  // tri 1
         1, -1,
        -1,  1,      
        -1,  1,  // tri 2
         1, -1,
         1,  1,
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
  
  
    // lookup the sampler locations.
    const u_image0Location = gl.getUniformLocation(program, "u_image0");
    const u_image1Location = gl.getUniformLocation(program, "u_image1");

    const u_scrollValLocation=gl.getUniformLocation(program, "u_scrollVal");
    let scrollAmount=0.0;
    gl.uniform1f(u_scrollValLocation, scrollAmount); 

    scrollRef.current.addEventListener("scroll",(event)=>{
      const scrollVal=event.target.scrollTop;
      const maxScroll=event.target.scrollHeight-event.target.clientHeight;
      if(true/* (Math.abs((scrollVal/maxScroll)-scrollAmount)>0.05) || scrollVal/maxScroll===0 */){
        scrollAmount=scrollVal/maxScroll;

        gl.uniform1f(u_scrollValLocation,scrollAmount);
        drawLoop(); 
      }

    })
  
    const drawLoop=()=>{
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

    



  let image=images[0];
  const canvasAspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const imageAspect = image.width / image.height;
  let scaleX;
  let scaleY;
  let scaleMode="cover";

  switch (scaleMode) {
    case 'fitV':
      scaleY = 1;
      scaleX = imageAspect / canvasAspect;
      break;
    case 'fitH':
      scaleX = 1;
      scaleY = canvasAspect / imageAspect;
      break;
    case 'contain':
      scaleY = 1;
      scaleX = imageAspect / canvasAspect;
      if (scaleX > 1) {
        scaleY = 1 / scaleX;
        scaleX = 1;
      }
      break;
    case 'cover':
      scaleY = 1;
      scaleX = imageAspect / canvasAspect;
      if (scaleX < 1) {
        scaleY = 1 / scaleX;
        scaleX = 1;
      }
      break;
    default: 
        scaleY = 1;
        scaleX = imageAspect / canvasAspect;
        if (scaleX < 1) {
            scaleY = 1 / scaleX;
            scaleX = 1;
        }
  }

  let u_matrix = gl.getUniformLocation(program, "u_matrix");
  gl.uniformMatrix4fv(u_matrix, false, new Float32Array([
    scaleX, 0, 0, 0,
    0, -scaleY, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]))

  
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    let size = 2;          // 2 components per iteration
    let type = gl.FLOAT;   // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);


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
    drawLoop()
    
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
  