# Face UV

Paint a texture onto your face. The webcam finds your face, and a mesh with `mesh_map.jpg` wrapped around it follows you as you move. The canvas fills the browser window, and the webcam view scales up to fit it, so your face stays the right size and position. The webcam picture itself is hidden.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page you open. Loads p5.js, ml5.js (face tracking) and the sketch. |
| `face_uv.js` | The p5.js sketch. Finds your face in the webcam and draws the textured mesh over a grey background. |
| `mesh_map.jpg` | The texture wrapped around the face. |

## Running it

1. Open `index.html` from `http://localhost`, for example with **Go Live** in VS Code. Double-clicking the file won't work.
2. Allow the camera when the browser asks.

## How it works

1. ml5.js `faceMesh` finds 468 points on your face in each webcam frame. The sketch waits for the model to load (`await faceMesh.ready`) before it starts detecting.
2. `getTriangles()` lists which three points make up each triangle of the mesh.
3. `getUVCoords()` gives each point its position on the texture, from 0 to 1. That's why the sketch uses `textureMode(NORMAL)`.
4. Each frame, the sketch scales the webcam view to fit the window, keeping its proportions and centring it.
5. It draws every triangle with `vertex(x, y, u, v)`, so the texture stretches to fit your face.
6. It draws a circle on each eye, using the `leftEye` and `rightEye` positions from ml5.

## Changing the texture

Replace `mesh_map.jpg` with your own image, or change the filename in `face_uv.js`. Paint on top of the original so your artwork lines up with the eyes, nose and mouth.
