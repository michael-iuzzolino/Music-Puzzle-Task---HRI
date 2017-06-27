from music_app import app
from flask import render_template, jsonify
import os

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/load_melodies")
def load_melodies():

    # Melody Audio Files
    melodies_path = os.path.join(os.getcwd(), "music_app/static/data/audio_files/melodies")
    melody_audio_files = [audio_file for audio_file in os.listdir(melodies_path) if ".mp3" in audio_file]

    # Melody Info Files
    melodies_info_path = os.path.join(os.getcwd(), "music_app/static/data/melody_info")
    melodies_info_files = [os.path.join(melodies_info_path, info_file) for info_file in os.listdir(melodies_info_path) if ".txt" in info_file]

    info_files = []
    for info_file in melodies_info_files:
        with open(info_file, "r") as infile:
            info_files.append(infile.read().split(","))

    melody_result = [{"audio_path" : os.path.join("/static/data/audio_files/melodies", audio_file), "info" : info_file } for audio_file, info_file in zip(melody_audio_files, info_files)]

    return jsonify(melody_result)