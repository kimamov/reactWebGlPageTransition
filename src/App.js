import React, { Component } from 'react'
import './styles/main.css';
import vertexShaderSource from './shaders/vertex-shader.js';
import fragmentShaderSource from './shaders/fragment-shader.js';
import createWebGlCanvas from './createMultTexture.js';
import imageOne from './imageOne.jpg'
import imageTwo from './imageTwo.jpg'


export default class App extends Component {
  constructor(props) {
    super(props)
    this.canvasRef=React.createRef();
    this.scrollRef=React.createRef();
    this.webGlContext=null;
    this.state = {
    }
  }

  componentDidMount(){
    this.createWebGlContext();
    if(this.canvasRef.current && this.scrollRef.current){
      this.resizeCanvas(this.webGlContext.canvas);
      createWebGlCanvas(this.webGlContext, vertexShaderSource, fragmentShaderSource, [imageTwo, imageOne], this.scrollRef);
      window.addEventListener("resize",()=>{
        // handle resize feed shader new values after resize
        this.resizeCanvas(this.webGlContext.canvas)
        createWebGlCanvas(this.webGlContext, vertexShaderSource, fragmentShaderSource, [imageTwo, imageOne], this.scrollRef);
      })
    }
  }

  handleScroll=(event)=>{
    const scrollVal=event.target.scrollTop;
    const maxScroll=event.target.scrollHeight-event.target.clientHeight;
    document.title=scrollVal/maxScroll;
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
        <canvas ref={this.canvasRef}/>
        <main ref={this.scrollRef}>
          <div className={"content"}></div>
        </main>
        
      </div>
    )
  }
}
