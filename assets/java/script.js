//Constants which force score increments by 10 and max number of gif rounds to run within time available = 3 for now as MVP)
const SCORE_POINTS = 10
const MAX_QUESTIONS = 3


// Handles timer on clicking 'START GAME'
function startTimer(){
  var counter = 10;
  setInterval(function() {
    counter--;
    if (counter >= 0) {
      span = document.getElementById("timer-element");
      span.innerHTML = ('0' + counter ).slice(-2);
    }
    if (counter === 0) {
        //<line of code here to save results to localStorage and redirect to lscorescreen.html>
        clearInterval(counter);
        return window.location.assign('./scorescreen.html')
    }

  }, 1000);
}
function start()
{
    document.getElementById("timer-element");
    startTimer();
};

// return random word from a given list
function returnRandomWord(wordArray) {
    var randomIndex = Math.floor(Math.random()*wordArray.length)

    return wordArray[randomIndex];
}

// return a list of synonyms for the parsed word
function getSynonyms(word) {
    var synonymsList = 
    fetch('https://wordsapiv1.p.rapidapi.com/words/'+word+'/synonyms', 
    {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
            'X-RapidAPI-Key': 'API_KEY_HERE'
        }
    })
    .then(response => response.json()) // convert response to json
    .then(data => data.synonyms) // return the list of synonyms
    .catch(err => console.error(err)); // consol log error if any

    return synonymsList;
}

// function to return gifs and populate placeholders based on getSynonyms()
// {insert code here}


// Handles question generation and stores and tallies correct and incorrect answers
var gifs = Array.from(document.querySelectorAll('#question'));
var right = document.querySelector("right");
var wrong = document.querySelector("wrong");

// Defined by functions below
let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let availableQuestions = []

    // // Based on 3 rounds of Gifs
    let questions = [
    {
        // question:
        // string combo of gifs returned based on synonym returned by WordsAPI call related to <chosen word>
        // answer:
        // <chosen word>,
    },
    {
        // question:
        // string combo of gifs returned based on synonym returned by WordsAPI call related to <chosen word>
        // answer:
        // <chosen word>,
    },
    {
        // question:
        // string combo of gifs returned based on synonym returned by WordsAPI call related to <chosen word>
        // answer:
        // <chosen word>,
    }
]

// function to return another question and answer combo when ruser clears round
function getNewQuestion() {
// {insert code here}
}


//When all 3 questions answered, save score to leaderboard and end round
getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)
        return window.location.assign('./scorescreen.html')
    }

// Increment score if answer is correct
    let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

    if(classToApply === 'correct') {
        incrementScore(SCORE_POINTS)
    }

//When time is out, disable getNewQuestion
    setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply)
        getNewQuestion()

    }, 200)
}
