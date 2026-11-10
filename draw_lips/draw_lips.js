let faceMesh, video, faces = [];
let outer = [61, 185, 40, 39, 37, 0, 267, 269, 270,
  409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
let inner = [78, 191, 80, 81, 82, 13, 312, 311, 310,
  415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];

async function setup() {
  // p5.js 2 has no preload(), so wait for the model to finish loading here
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true });
  await faceMesh.ready;

  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
}

function gotFaces(results) { faces = results; }

function draw() {
  image(video, 0, 0, width, height);
  if (faces.length > 0) {
    let face = faces[0];
    noStroke();
    fill(220, 30, 80);
    drawLips(face);
  }
}

// Draw the outer lip shape with the inner mouth cut out as a hole
function drawLips(face) {
  beginShape();
  for (let i of outer) {
    let p = face.keypoints[i];
    vertex(p.x, p.y);
  }
  // A contour cuts a hole; it must wind the opposite way, so go through inner backwards
  beginContour();
  for (let j = inner.length - 1; j >= 0; j--) {
    let p = face.keypoints[inner[j]];
    vertex(p.x, p.y);
  }
  endContour(CLOSE);
  endShape(CLOSE);
}