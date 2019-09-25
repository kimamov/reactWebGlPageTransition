
  const main=function(gl, vertexShader, fragmentShader, imageArray, scrollRef) {
    let imageOutput=[]
    let imageCreatedCount=0;
    imageArray.forEach((element, index)=>{
        let image=new Image();
        image.src=element;
        image.onload=()=>{
            //imageOutput.push((image))
            imageOutput[index]=image;
            imageCreatedCount++;
            if(imageCreatedCount===imageArray.length){
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


    // create texture for every image in images array
    let textures = [];
    for (let i = 0; i < images.length; ++i) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
  
      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  
      // Upload the image into the texture.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
  
      // add the texture to the array of textures.
      textures.push(texture);
    }
  
  
    // lookup the sampler locations.
    const u_image0Location = gl.getUniformLocation(program, "u_image0");
    const u_image1Location = gl.getUniformLocation(program, "u_image1");

    let scrollAmount=0.0;
    let textureOffset=0;

    scrollRef.current.addEventListener("scroll",(event)=>{
      const scrollVal=event.target.scrollTop;
      //const maxScroll=event.target.scrollHeight-event.target.clientHeight;
      const maxScroll=event.target.clientHeight;
      if(true/* (Math.abs((scrollVal/maxScroll)-scrollAmount)>0.05) || scrollVal/maxScroll===0 */){
        let newTextureOffset=Math.floor(event.target.scrollTop/event.target.clientHeight);
        // only changed offset if there are still textures in the array (2 textures min required)
        if(newTextureOffset+2<=textures.length){
          /* avoids x%1 going to 0 in the end and resetting transition */
          scrollAmount=(scrollVal/maxScroll)%1;
          textureOffset=newTextureOffset;
          console.log(textureOffset)
        }
        drawLoop(textureOffset); 
      }

    })
  

    /* CALL WHEN SOMETHING CHANGES */
    const drawLoop=(textureOffset=0)=>{
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

  const u_scrollValLocation=gl.getUniformLocation(program, "u_scrollVal");
  gl.uniform1f(u_scrollValLocation, scrollAmount); 



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
    gl.bindTexture(gl.TEXTURE_2D, textures[0+textureOffset]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[1+textureOffset]);
  
    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    }// end drawLoop()
    
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
  