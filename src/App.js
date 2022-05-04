import React, {useRef, useState} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import {drawFacemesh} from './utilities'

function App() {
  // setup references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [Bool, setBool] = useState(true);
  const [Int, setInt] = useState(null);

  // load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution:{width:640, height:480}, scale:0.8
    });
    // continuously rerenders the facemesh to keep aligning onto the face
    setInt(
    setInterval(() =>{
      detect(net)
    }, 10)
    ) 
  };
  

  // detect function
  const detect = async (net) => {
    if(
      typeof webcamRef.current !=='undefined' && 
      webcamRef.current !== null && 
      webcamRef.current.video.readyState===4 // 4 === completed
    ){    
      // video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // set video width and height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set canvas width and height
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // make detections
      const face = await net.estimateFaces(video);
      
      // get canvas context for drawing
      const ctx = canvasRef.current.getContext("2d");
      drawFacemesh(face, ctx);
    }
  };

  function startTrack(){
    setBool(!Bool);
    runFacemesh();
  }

  function stopTrack(){
    setBool(!Bool);
    clearInterval(Int);
    setInt(null);
  }
  
  return (
    <div className="App">
      <Webcam ref={webcamRef} style={
        {
          position:'absolute',
          marginLeft:'auto',
          marginRight:'auto',
          left:0,
          right:0,
          textAlign:'center',
          zIndex:9,
          width:640,
          height:480
        }
      } />
      <canvas ref={canvasRef} style={
        {
          position:'absolute',
          marginLeft:'auto',
          marginRight:'auto',
          left:0,
          right:0,
          textAlign:'center',
          zIndex:9,
          width:640,
          height:480
        }
      } />
      <button onClick={Bool? startTrack : stopTrack} style={
        {
          position:'absolute',
          marginTop:'500px',
          marginLeft:'auto',
          marginRight:'auto',
          left:0,
          right:0,
          textAlign:'center',
          zIndex:9,
          width:100,
          height:50
        }
      }>{Bool? "start" : "pause"}</button>
    </div>
  );
}

export default App;
