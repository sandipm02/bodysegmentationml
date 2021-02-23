import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import { Row, Col, Container } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style/webcam.css'

function App() {

  const camera = useRef(null);
  const createCanvas = useRef(null);
  
  const drawBody = async () => {
    const net = await bodyPix.load();
    setInterval(() => {
      checkCamera(net);
    }, 100);
  };
  
  const drawing = async (net,video) => {
    const person = await net.segmentPersonParts(video);
    const coloredPartImage = bodyPix.toColoredPartMask(person);
    const opacity = 1;
    const canvas = createCanvas.current;
    bodyPix.drawMask(canvas, video, coloredPartImage, opacity);
  }
  
  const checkCamera = async (net) => {
    if (
      typeof camera.current !== "undefined" &&
      camera.current !== null &&
      camera.current.video.readyState === 4
    ) {
      continueRender(net);
    }
    console.log("error camera isn't detected")
  };
  
  const continueRender = async(net) => {
    const video = camera.current.video;
    const videoWidth = camera.current.video.videoWidth;
    const videoHeight = camera.current.video.videoHeight;
    camera.current.video.width = videoWidth;
    camera.current.video.height = videoHeight;
    createCanvas.current.width = videoWidth;
    createCanvas.current.height = videoHeight;
    drawing(net,video);
  }
  
  drawBody();

  return (
    <div className="full">
      <Container>
        <Row>
          <Col sm={6}>
            <h1>Camera</h1>
            <Webcam ref={camera} className="webcam" />
          </Col>
          <Col sm={6}>
            <h1>ML interpretation</h1>
            <canvas ref={createCanvas} className="canvasArea"/>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
