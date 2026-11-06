// A simple starter: get the points of your face from the webcam and draw them
// See README.md for how to run it

let faceMesh;
let video;
let faces = [];   // the faces ml5 found in the latest video frame

// flipped mirrors the face points, so moving left moves the points left
let options = { maxFaces: 1, flipped: false };

async function setup() {
  // ml5.faceMesh() returns right away, so wait for the model to finish loading
  faceMesh = ml5.faceMesh(options);
  await faceMesh.ready;

  createCanvas(windowWidth, windowHeight);

  video = createCapture(VIDEO);
  video.hide();

  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background(0);

  // The points are in webcam pixels, so scale them to fit the canvas
  scale(min(width / video.width, height / video.height));
  image(video, 0, 0);
  noStroke();
  fill(0, 255, 120);

  for (let face of faces) {
    for (let keypoint of face.keypoints) {
      circle(keypoint.x, keypoint.y, 3);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
