/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates UV mapping with ml5.faceMesh.
 */

let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: true, flipped: true };

let uvMapImage;

let triangulation;
let uvCoords;

async function setup() {
  // ml5.faceMesh() returns right away, so wait for the model to finish loading
  faceMesh = ml5.faceMesh(options);
  await faceMesh.ready;
  uvMapImage = await loadImage("mesh_map.jpg");

  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  // Get the Coordinates for the uv mapping
  triangulation = faceMesh.getTriangles();
  uvCoords = faceMesh.getUVCoords();
}

function draw() {
  background(51);

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
    texture(uvMapImage);
    textureMode(NORMAL);
    beginShape(TRIANGLES);
    for (let i = 0; i < triangulation.length; i++) {
      let indexA = triangulation[i][0];
      let indexB = triangulation[i][1];
      let indexC = triangulation[i][2];
      let a = face.keypoints[indexA];
      let b = face.keypoints[indexB];
      let c = face.keypoints[indexC];
      let uvA = { x: uvCoords[indexA][0], y: uvCoords[indexA][1] };
      let uvB = { x: uvCoords[indexB][0], y: uvCoords[indexB][1] };
      let uvC = { x: uvCoords[indexC][0], y: uvCoords[indexC][1] };
      vertex(a.x, a.y, uvA.x, uvA.y);
      vertex(b.x, b.y, uvB.x, uvB.y);
      vertex(c.x, c.y, uvC.x, uvC.y);
    }
    endShape();

  }
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
