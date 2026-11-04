# Face Tic test

Turn a Pololu Tic stepper motor with your face. The webcam finds your nose, and the motor turns to follow it as you move your head left and right.

This is a copy of `face_test`, changed to drive a Tic over USB instead of a servo gimbal on an Arduino.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page you open. Loads p5.js, ml5.js (face tracking), `ticController.js` and the sketch. |
| `face_tic.js` | The p5.js sketch. Finds your nose in the webcam and tells the Tic where to turn. |
| `ticController.js` | Shared helper loaded from https://peterogers.github.io/share_resources/ticController.js. It talks to the Tic over WebUSB and adds the **Add Tic…** button and the motor panels. |

## Running it

1. Set the Tic's control mode to **Serial / I2C / USB** in the Tic Control Center, then close the Control Center. Only one program can use the Tic at a time.
2. Plug the Tic in with USB and power the motor.
3. Open `index.html` from `http://localhost`, for example with **Go Live** in VS Code.
4. Use **Chrome** or **Edge**, because other browsers don't support WebUSB.
5. Allow the camera when the browser asks.
6. Click **Add Tic…** and pick the Tic.
7. Line the motor up where you want 0°, press **Set 0° here**, then energize it.

## Adjusting it

- The min and max angles, speed, current and invert are in the panel under the canvas.
- If your Tic isn't a T500, change `product: "T500"` in `face_tic.js` to `"T825"`, `"T834"` or `"T249"` so the current limit is set correctly.
