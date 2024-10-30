from flask import Flask, request, jsonify, render_template
import cv2
import numpy as np

app = Flask(__name__)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

@app.route("/detect_faces", methods=["POST"])
def detect_faces():
    # Read the frame data from the request
    file = request.files["frame"].read()
    np_arr = np.frombuffer(file, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Perform face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    # Send back the result as JSON
    result = [{"x": int(x), "y": int(y), "w": int(w), "h": int(h)} for (x, y, w, h) in faces]
    return jsonify(result)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()
