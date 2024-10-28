# Facial Recognition

## Overview

This project implements a facial recognition system using Python and OpenCV. The system can detect and recognize faces in real-time from video streams or images.

## Features

- Real-time face detection and recognition
- Support for multiple faces
- Easy integration with camera

## Installation

1. Create a virtual environment

For Windows

```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

For Linux / mac

```
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

2. Run the web app or the notebook

### Notebook
```
jupyter nbconvert --to notebook --execute main.ipynb
```
- press q to quit

### Web app

```
python3 app.py
```
- Then visit http://localhost:5000/

## Acknowledgements

- OpenCV: https://opencv.org/
- NumPy: https://numpy.org/

## Contributors

- [Austin](https://github.com/aust21)
