from flask import Flask, request, render_template, session, jsonify
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension



app = Flask(__name__)
app.config["SECRET_KEY"] = "sshhh"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()



@app.route('/')
def homepage():
    '''Makes Boggle Game'''

    board = boggle_game.make_board()
    session['board'] = board

    return render_template('index.html', board=board)



@app.route('/check-word')
def is_word_valid():
    '''Checks if submitted word is a valid Boggle word'''

    word = request.args['word']
    board = session['board']
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})



@app.route('/game-over', methods=['POST'])
def scores():
    '''Updates and Returns highscore'''

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    plays = session.get("plays", 0)

    session['highscore'] = max(score, highscore)
    session['plays'] = plays + 1

    highscore = session.get("highscore")
    plays = session.get("plays")

    return jsonify({'highscore': highscore, 'plays': plays})