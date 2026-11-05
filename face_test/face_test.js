// Point the gimbal with your face using the webcam - no plane server needed
// Move your head left/right to pan, up/down to tilt
// Sends "pan,tilt" to the Arduino, so it works with gimbal_arduino.ino as it is
// See README.md for how to run it

let faceMesh;
let video;
let faces = [];    // the faces ml5 found in the latest video frame
let faceX;
let lastSend = 0;  // when we last sent to the Arduino (in milliseconds)

// flipped mirrors the face points, so moving left moves the crosshair left
let options = { maxFaces: 1, flipped: true };

const arduino = new ArduinoSerial({ baudRate: 115200 });

async function setup() {
  // ml5.faceMesh() returns right away, so wait for the model to finish loading
  faceMesh = ml5.faceMesh(options);
  await faceMesh.ready;

  createCanvas(windowWidth, windowHeight);
  faceX = width / 2;
 

  video = createCapture(VIDEO);
  video.hide();

  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background(15, 25, 50);

  // draw the webcam mirrored to match the face points
  push();
  translate(width, 0);
  scale(-1, 1);
  tint(255, 120);
  image(video, 0, 0, width, height);
  pop();

  //smooths the data from video 
  if (faces.length > 0) {
    let nose = faces[0].keypoints[1];
    faceX = lerp(faceX, map(nose.x, 0, video.width, 0, width), 0.3);
  }


  let pan = round(constrain(map(faceX, 0, width, 0, 180, 45, 140)));


  
  if (millis() - lastSend > 33) {
    arduino.send(pan + "," + tilt + "\n");
    lastSend = millis();
  }

  // crosshair where the face is
  stroke(0, 200, 255);
  line(faceX, 0, faceX, height);
 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
