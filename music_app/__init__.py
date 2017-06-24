from flask import Flask

app = Flask(__name__)

from music_app import views
