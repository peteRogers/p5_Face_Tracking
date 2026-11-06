# Face Ropes

A rope hanging from every point on your face. The webcam finds your face, and a rope is pinned to each of its 468 points. Move your head and they swing.

This is a copy of `face_points` with the shared `Rope` class added.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page you open. Loads p5.js, ml5.js (face tracking), `rope.js` and the sketch. |
| `face_ropes.js` | The p5.js sketch. Finds your face in the webcam and keeps a rope pinned to each of its points. |
| `rope.js` | Shared helper loaded from https://peterogers.github.io/share_resources/rope.js. It does the rope physics and drawing. |

## Running it

1. Open `index.html` from `http://localhost`, for example with **Go Live** in VS Code. Double-clicking the file won't work.
2. Allow the camera when the browser asks.

## Adjusting it

- The rope's length, swing, colour and thickness are in `ropeOptions` at the top of `face_ropes.js`.
- To hide the green dots, delete the `for` loop in `draw()` that draws `face.keypoints`.
