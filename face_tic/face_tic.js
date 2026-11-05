// Turn a Pololu Tic stepper motor with your face using the webcam
// Move your head left/right and the motor turns to follow
// The Tic buttons and settings come from ticController.js (in share_resources)
// See README.md for how to run it

const VIDEO_W = 640;
const VIDEO_H = 480;

let faceMesh;
let video;
let faces = [];   // the faces ml5 found in the latest video frame
let faceX;        // where the face is on the screen
let tic;

// flipped mirrors the face points, so moving left moves the line left
let options = { maxFaces: 1, flipped: true };

async function setup() {
  // ml5.faceMesh() returns right away, so wait for the model to finish loading
  faceMesh = ml5.faceMesh(options);
  await faceMesh.ready;

  createCanvas(VIDEO_W, VIDEO_H);
  faceX = width / 2;

  video = createCapture(VIDEO);
  video.size(VIDEO_W, VIDEO_H);
  video.hide();

  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);

  // position mode: the motor turns to an angle between its min and max
  // the panels below the canvas set the angles, speed and current
  tic = new TicController({ product: "T500", mode: "position" });
  tic.createControls();
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

  // follow the tip of the nose (keypoint 1)
  // lerp moves part of the way each frame so the motor doesn't jitter
  let found = faces.length > 0;
  if (found) {
    let nose = faces[0].keypoints[1];
    faceX = lerp(faceX, map(nose.x, 0, video.width, 0, width), 0.3);
  }

  // 0 = left edge, 1 = right edge
  // null means no face, so the motor holds still (or goes home if that's ticked)
  let x = constrain(faceX / width, 0, 1);
  tic.follow(found ? x : null);

  // line where the face is
  stroke(0, 200, 255);
  line(faceX, 0, faceX, height);

  noStroke();
  fill(255);
  textSize(16);
  text("x " + nf(x, 1, 2) + "   (" + tic.motors.length + " tic, " + faces.length + " face)", 20, 30);
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
