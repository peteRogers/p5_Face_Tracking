# Face Points

A simple starter sketch. The webcam finds your face and draws each of its points as a green dot. Use it as a starting point for your own face tracking ideas.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page you open. Loads p5.js, ml5.js (face tracking) and the sketch. |
| `face_points.js` | The p5.js sketch. Finds your face in the webcam and draws its points. |

## Running it

1. Open `index.html` from `http://localhost`, for example with **Go Live** in VS Code. Double-clicking the file won't work.
2. Allow the camera when the browser asks.

## Using the points

ml5.js `faceMesh` gives each face 468 points in `face.keypoints`, and each point has an `x`, `y` and `z`. For example, `faces[0].keypoints[1]` is the tip of the nose.
