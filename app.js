// app.js
const videoElement = document.getElementById("video");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// Initialize MediaPipe Holistic
const holistic = new Holistic({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
});

holistic.setOptions({
  modelComplexity: 1, // Optimized for mobile performance
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// Function to draw labels on the canvas
function drawLabel(ctx, text, x, y) {
  ctx.font = "12px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(text, x, y);
}

// Process the results from MediaPipe Holistic
holistic.onResults((results) => {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Draw face landmarks
  if (results.faceLandmarks) {
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
      color: "#C0C0C070",
      lineWidth: 1,
    });
  }

  // Draw pose landmarks
  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 4,
    });
    drawLandmarks(canvasCtx, results.poseLandmarks, { color: "#FF0000", lineWidth: 2 });
  }

  // Draw hand landmarks
  if (results.rightHandLandmarks) {
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
      color: "#00CCFF",
      lineWidth: 2,
    });
    drawLandmarks(canvasCtx, results.rightHandLandmarks, { color: "#FFCC00", lineWidth: 2 });
  }

  if (results.leftHandLandmarks) {
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
      color: "#FF33CC",
      lineWidth: 2,
    });
    drawLandmarks(canvasCtx, results.leftHandLandmarks, { color: "#33FFCC", lineWidth: 2 });
  }
});

// Initialize the camera with optimized settings for mobile
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({ image: videoElement });
  },
  width: 480, // Optimized resolution for mobile
  height: 360,
  facingMode: "environment", 
});

// Adjust canvas size dynamically to match video feed
videoElement.addEventListener("loadeddata", () => {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
});

camera.start();
