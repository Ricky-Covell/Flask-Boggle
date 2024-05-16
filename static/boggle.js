const foundWords = new Set();
let currentScore = 0;


const $gameContainer = $('#game-container');
const $addWord = $('#add-word');
const $currentScore = $('#current-score')
const $wordStatus = $('#word-status');
const $timer = $('#timer');


const $gameoverContainer = $('#gameover-container');
const $finalscore = $("#final-score");
const $highscore = $('#highscore');
const $numOfPlays = $('#num-of-plays');




// Game Timer
let seconds = 20
let timer = setInterval(countdown, 1000)





//FUNCTIONS



//Starts game
function beginGame(){
    $addWord.on('submit', handleSubmit);
    $timer.text(`Timer: ${seconds} seconds`);
}



// Checks to see if word is valid when submitted
async function handleSubmit(evt){
    evt.preventDefault();
    const word = $('#new-word').val();
    $('#new-word').val('')

    if (!word) {
        $wordStatus.text(`Enter a word!`)
        return;
    }

    if (foundWords.has(word)) {
        $wordStatus.text(`${word} has already been found!`)
        return;
    }

    const resp = await axios.get('/check-word', {params: {word: word}})

    if (resp.data.result === 'not-word') {
        $wordStatus.text(`${word} is not a valid word :(`)
    } else if (resp.data.result === 'not-on-board') {
        $wordStatus.text(`${word} is not on the board :(`)
    } else {
        $wordStatus.text(`${word} is valid :)`)
        foundWords.add(word);
        currentScore += word.length;
        $currentScore.text(`Score: ${currentScore}`)
    }
}


// Timer Callback to decrements seconds and clear timer when seconds hits 0
function countdown(){
    console.log('tick')
    seconds -= 1;
    $timer.text(`Timer: ${seconds} seconds`)

if (seconds === 0){
    gameOver();
    clearInterval(timer);
    return;
}}



// Posts score to server    && Gets back player stats from flask session    && Shows Stats
async function gameOver(){
    
    const resp = await axios.post('/game-over', { score: currentScore })

    $finalscore.text(`Score: ${currentScore}`);
    $highscore.text(`Highscore: ${resp.data.highscore}`);
    $numOfPlays.text(`Plays: ${resp.data.plays}`);
    $gameoverContainer.append(
        `<form action="/">
            <button>Play Again?</button>
        </form>`
)

    $gameContainer.hide();
    $gameoverContainer.show();
}



//START
beginGame();