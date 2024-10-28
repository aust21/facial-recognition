const videoElement = document.getElementById("recording");
const overlay = document.getElementById("overlay");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const captureInterval = 100;
let intervalId;

// Function to draw rectangles around faces on the canvas
function drawFaceBoxes(faces) {
  const context = overlay.getContext("2d");

  // Clear previous drawings
  context.clearRect(0, 0, overlay.width, overlay.height);

  // Draw each face as a rectangle
  faces.forEach((face) => {
    context.strokeStyle = "green";
    context.lineWidth = 2;
    context.strokeRect(face.x, face.y, face.w, face.h);
  });
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    videoElement.classList.add("started");
    overlay.classList.add("started");
    videoElement.srcObject = stream;

    // Wait for video metadata to load to get correct dimensions
    await new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve();
      };
    });

    // Set canvas dimensions to match video
    overlay.width = videoElement.videoWidth;
    overlay.height = videoElement.videoHeight;

    // Set video dimensions to match as well
    videoElement.width = videoElement.videoWidth;
    videoElement.height = videoElement.videoHeight;

    videoElement.play();
    startFrameCapture();
    startButton.style.display = "none";
    stopButton.style.display = "block";
  } catch (error) {
    console.error("Camera access denied or not available:", error);
  }
}

async function startFrameCapture() {
  intervalId = setInterval(async () => {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext("2d");

      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Debug: Log canvas dimensions and data
      console.log("Canvas dimensions:", canvas.width, canvas.height);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );
      await sendFrameToBackend(blob);
    }
  }, captureInterval);
}

async function sendFrameToBackend(frameBlob) {
  const formData = new FormData();
  formData.append("frame", frameBlob);

  try {
    const response = await fetch("/detect_faces", {
      method: "POST",
      body: formData,
    });

    const faces = await response.json();
    console.log("Received faces:", faces);
    drawFaceBoxes(faces);
  } catch (error) {
    console.error("Error sending frame:", error);
  }
}

function stopRecording() {
  videoElement.classList.remove("started");
  overlay.classList.remove("started");
  clearInterval(intervalId);
  if (videoElement.srcObject) {
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
  }
  startButton.style.display = "block";
  stopButton.style.display = "none";
  overlay.getContext("2d").clearRect(0, 0, overlay.width, overlay.height);
}

startButton.addEventListener("click", startCamera);
stopButton.addEventListener("click", stopRecording);
