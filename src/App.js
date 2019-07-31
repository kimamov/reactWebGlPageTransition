import React, { Component } from 'react'
import './styles/main.css';
import vertexShaderSource from './shaders/vertex-shader.js';
import fragmentShaderSource from './shaders/fragment-shader.js';
import createWebGlCanvas from './createMultTexture.js';
import imageOne from './imageOne.jpg'
import imageTwo from './imgTwo.jpg'


export default class App extends Component {
  constructor(props) {
    super(props)
    this.canvasRef=React.createRef();
    /* this.canvasWidth=1900;
    this.canvasHeight=400; */
    this.webGlContext=null;
    this.state = {
    }
  }

  componentDidMount(){
    this.createWebGlContext();
    this.resizeCanvas(this.webGlContext.canvas);
    createWebGlCanvas(this.webGlContext, vertexShaderSource, fragmentShaderSource, imageOne);
    window.addEventListener("resize",()=>{
      // handle resize feed shader new values after resize
      this.resizeCanvas(this.webGlContext.canvas)
      createWebGlCanvas(this.webGlContext, vertexShaderSource, fragmentShaderSource, imageOne);
    })
  }


  createWebGlContext=()=>{
    this.webGlContext=this.canvasRef.current.getContext("webgl");
    if(!this.webGlContext){
      alert("your machine does not support webGl")
    }
  }



  resizeCanvas=(canvas)=>{
    canvas.width=canvas.clientWidth;
    canvas.height=canvas.clientHeight;
  }




  render() {
    return (
      <div className="App">
        <header className="App-header">
     
        </header>
        <canvas /* style={{height: `${this.canvasHeight}px`,width: `${this.canvasWidth}px`}} */ ref={this.canvasRef}/>
        <main>

        </main>
        
      </div>
    )
  }
}
