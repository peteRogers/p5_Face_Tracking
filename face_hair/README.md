# Face Hair

Hair made of ropes. The webcam finds your face, and ropes hang from the top and sides of it. Move your head and they swing.

This is a copy of `face_ropes`. It only uses the face points around the top and sides of the face, and adds more ropes between them. Each hair gets its own random position, length and curl.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page you open. Loads p5.js, ml5.js (face tracking), `rope.js` and the sketch. |
| `face_hair.js` | The p5.js sketch. Finds your face in the webcam and keeps the hair pinned to it. |
| `rope.js` | Shared helper loaded from https://peterogers.github.io/share_resources/rope.js. It does the rope physics and drawing. |

## Running it

1. Open `index.html` from `http://localhost`, for example with **Go Live** in VS Code. Double-clicking the file won't work.
2. Allow the camera when the browser asks.

## Adjusting it

- `ropesBetween` at the top of `face_hair.js` sets how thick the hair is.
- `scatter`, `lengthRange`, `curlSize` and `curlTurns` set how messy and curly it is. Set `curlSize` to `[0, 0]` for straight hair.
- `HAIRLINE` lists the face points the hair grows from, and `hairLift` moves them further up your head.
- The rope's length, swing, colour and thickness are in `ropeOptions`.
- To see yourself behind the hair, uncomment the `image(video, 0, 0)` line in `draw()`.
