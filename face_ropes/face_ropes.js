// A rope hanging from every point on your face, using the webcam and the shared Rope class
// See README.md for how to run it

let faceMesh;
let video;
let faces = [];   // the faces ml5 found in the latest video frame

let ropes = [];   // one rope per face point, made when the first face is found

// flipped mirrors the face points, so moving left moves the points left
let options = { maxFaces: 1, flipped: false };

// How the ropes look and swing. Sizes are in webcam pixels.
// There are 468 ropes, so raise segments and stiffness carefully.
let ropeOptions = {
  length: 50,
  segments: 6,
  gravity: 0.5,
  damping: 0.98,   // 1 = swings forever, lower = settles faster
  stiffness: 1,    // higher = less stretchy
  color: "#d9b26f",
  thickness: 1,
};

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
  //image(video, 0, 0);
  noStroke();
  fill(0, 255, 120);

  // for (let face of faces) {
  //   for (let keypoint of face.keypoints) {
  //     circle(keypoint.x, keypoint.y, 3);
  //   }
  // }

  // Keep the top of each rope on its point. Without a face they stay where they were.
  if (faces.length > 0) {
    let keypoints = faces[0].keypoints;

    if (ropes.length === 0) {
      for (let keypoint of keypoints) {
        ropes.push(new Rope(keypoint.x, keypoint.y, ropeOptions));
      }
    }

    for (let i = 0; i < ropes.length; i++) {
      ropes[i].pinStart(keypoints[i].x, keypoints[i].y);
    }
  }

  for (let rope of ropes) {
    rope.update();
    rope.draw();
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
