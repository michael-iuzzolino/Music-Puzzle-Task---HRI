from music_app import app
from flask import render_template, jsonify
import os
import re

@app.route("/")
def index():
    return render_template("index.html")


def sort_files(unsorted_list):
    sorted_list = []
    for i in range(len(unsorted_list)):
        for file_name in unsorted_list:
            file_num = int(re.findall(r'\d+', file_name)[0])
            if (file_num == i+1):
                sorted_list.append(file_name)

    return sorted_list

@app.route("/load_melodies")
def load_melodies():

    # Melody Audio Files
    melodies_path = os.path.join(os.getcwd(), "music_app/static/data/audio_files/melodies")

    # Sort audio files
    melody_audio_files_sorted = sorted((audio_file for audio_file in os.listdir(melodies_path) if ".mp3" in audio_file), key=lambda n: int(re.findall(r'\d+', n)[0]))

    # Melody Info Files
    melodies_info_path = os.path.join(os.getcwd(), "music_app/static/data/melody_info")
    melodies_info_files = sorted((os.path.join(melodies_info_path, info_file) for info_file in os.listdir(melodies_info_path) if ".txt" in info_file), key=lambda n: int(re.findall(r'\d+', n)[-1]))


    info_files = []
    for info_file in melodies_info_files:
        with open(info_file, "r") as infile:
            info_files.append(infile.read().split(","))

    melody_result = [{"audio_path" : os.path.join("/static/data/audio_files/melodies", audio_file), "info" : info_file } for audio_file, info_file in zip(melody_audio_files_sorted, info_files)]

    return jsonify(melody_result)