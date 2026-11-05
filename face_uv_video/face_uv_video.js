/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example uses the webcam image of your face as the texture for ml5.faceMesh.
 */

let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: true, flipped: true };

let triangulation;

async function setup() {
  // ml5.faceMesh() returns right away, so wait for the model to finish loading
  faceMesh = ml5.faceMesh(options);
  await faceMesh.ready;

  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  // Get the triangles that make up the mesh
  triangulation = faceMesh.getTriangles();
}

function draw() {
 // background(51);

  // Scale the webcam view to fit the canvas, keeping its proportions
  // WEBGL puts (0, 0) in the middle, so this centres the view too
  scale(min(width / video.width, height / video.height));
  translate(-video.width / 2, -video.height / 2);

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i]; 

    // Draw a circle on each eye, just in front of the mesh
    fill(0, 200, 255);
    for (let eye of [face.leftEye, face.rightEye]) {
      push();
      translate(eye.centerX, eye.centerY, 0);
      
      fill(255);
      circle(0, 0, eye.width);
      fill(0);
      circle(0, 0, eye.width/2);
      pop();
    }
    // Draw all the triangles
    noStroke();
    texture(video);
    textureMode(NORMAL);
    beginShape(TRIANGLES);
    for (let i = 0; i < triangulation.length; i++) {
      let indexA = triangulation[i][0];
      let indexB = triangulation[i][1];
      let indexC = triangulation[i][2];
      let a = face.keypoints[indexA];
      let b = face.keypoints[indexB];
      let c = face.keypoints[indexC];
      faceVertex(a);
      faceVertex(b);
      faceVertex(c);
    }
    endShape();

  }
}

// Add a mesh point, using its position in the webcam image as the texture position
// The points are mirrored (flipped: true) but the image isn't, so u is reversed
function faceVertex(p) {
  vertex(p.x, p.y, 1 - p.x / video.width, p.y / video.height);
}

// Keep the canvas the same size as the browser window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
