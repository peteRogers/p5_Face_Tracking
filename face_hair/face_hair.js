// Hair made of ropes, hanging from the top and sides of your face, using the webcam and the shared Rope class
// See README.md for how to run it

let faceMesh;
let video;
let faces = [];   // the faces ml5 found in the latest video frame

let hairs = [];   // one rope per hair plus its own curl, made when the first face is found

// flipped mirrors the face points, so moving left moves the points left
let options = { maxFaces: 1, flipped: false };

// The face points around the top and sides of your face, from one side over to the other
const HAIRLINE = [132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361];

let hairLift = 1.3;     // moves the hairline up your head, away from your chin. 1 = on the edge of your face

let ropesBetween = 5;   // extra ropes between each pair of points (more = thicker hair)

// Each hair gets its own random values from these ranges, in webcam pixels
let scatter = 12;              // how far a hair's root can be from the hairline
let lengthRange = [0.6, 1.3];  // hair length, as a multiple of ropeOptions.length
let curlSize = [3, 12];        // small = wavy, big = loops
let curlTurns = [2, 5];        // how many times it winds along its length

// How the ropes look and swing. Sizes are in webcam pixels.
// There are over 100 ropes, so raise segments and stiffness carefully.
let ropeOptions = {
  length: 150,
  segments: 24,    // curls need plenty of points to look smooth
  gravity: 0.5,
  damping: 0.98,   // 1 = swings forever, lower = settles faster
  stiffness: 5,    // higher = less stretchy
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
  image(video, 0, 0);

  // Keep the top of each rope on its spot. Without a face they stay where they were.
  if (faces.length > 0) {
    let points = hairPoints(faces[0].keypoints);

    if (hairs.length === 0) {
      for (let point of points) {
        hairs.push(makeHair(point));
      }
    }

    for (let i = 0; i < hairs.length; i++) {
      let hair = hairs[i];
      hair.rope.pinStart(points[i].x + hair.offsetX, points[i].y + hair.offsetY);
    }
  }

  for (let hair of hairs) {
    hair.rope.update();
    drawHair(hair);
  }
}

// A rope with its own random length, position and curl
function makeHair(point) {
  let length = ropeOptions.length * random(lengthRange[0], lengthRange[1]);

  return {
    rope: new Rope(point.x, point.y, { ...ropeOptions, length: length }),
    offsetX: random(-scatter, scatter),
    offsetY: random(-scatter, scatter),
    curlSize: random(curlSize[0], curlSize[1]),
    curlTurns: random(curlTurns[0], curlTurns[1]),
    curlStart: random(TWO_PI),
  };
}

// Draw a hair as a coil around its rope. The rope still does the swinging.
function drawHair(hair) {
  let rope = hair.rope;

  noFill();
  stroke(rope.color);
  strokeWeight(rope.thickness);

  beginShape();
  for (let i = 0; i < rope.points.length; i++) {
    let point = rope.points[i];
    let along = i / (rope.points.length - 1);   // 0 at the root, 1 at the tip

    // The coil starts at nothing, so the root stays on the head
    let angle = hair.curlStart + along * hair.curlTurns * TWO_PI;
    let size = hair.curlSize * along;
    splineVertex(point.x + cos(angle) * size, point.y + sin(angle) * size);
  }
  endShape();
}

// Every spot a hair grows from: the HAIRLINE points, plus evenly spaced spots between them
function hairPoints(keypoints) {
  let points = [];

  for (let i = 0; i < HAIRLINE.length - 1; i++) {
    let a = keypoints[HAIRLINE[i]];
    let b = keypoints[HAIRLINE[i + 1]];

    for (let j = 0; j <= ropesBetween; j++) {
      let t = j / (ropesBetween + 1);
      points.push({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
    }
  }

  // The loop stops short of the last point, so add it here
  let last = keypoints[HAIRLINE.at(-1)];
  points.push({ x: last.x, y: last.y });

  // Stretch every spot away from the chin (point 152), so the top of the
  // hairline moves furthest and it still follows your head when you tilt it
  let chin = keypoints[152];
  for (let point of points) {
    point.x = chin.x + (point.x - chin.x) * hairLift;
    point.y = chin.y + (point.y - chin.y) * hairLift;
  }

  return points;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
