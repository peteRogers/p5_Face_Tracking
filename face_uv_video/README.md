# Face UV Video

A copy of `face_uv` that uses your own face as the texture. Instead of `mesh_map.jpg`, the mesh is painted with the live webcam image, so your face appears cut out on a grey background. The canvas fills the browser window, and the eye circles show through the holes in the mesh.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page you open. Loads p5.js, ml5.js (face tracking) and the sketch. |
| `face_uv_video.js` | The p5.js sketch. Finds your face in the webcam and draws the mesh using the webcam image as its texture. |

## Running it

1. Open `index.html` from `http://localhost`, for example with **Go Live** in VS Code. Double-clicking the file won't work.
2. Allow the camera when the browser asks.

## How it works

1. ml5.js `faceMesh` finds the points on your face in each webcam frame, and `getTriangles()` lists which three points make up each triangle.
2. Each frame, the sketch scales the webcam view to fit the window, keeping its proportions and centring it.
3. Each point's position in the webcam image becomes its texture position, from 0 to 1 (`faceVertex()`). The points are mirrored but the image isn't, so `u` is reversed.
4. `texture(video)` paints the triangles with the current webcam frame.
