// testing getSynonyms() function
// getSynonyms("book").then(data => console.log(data))
// Variable elements
var gifs = Array.from(document.querySelectorAll('.gifs-combo'));
var timerElement = document.querySelector(".timer-count");
var right = document.querySelector("right");
var wrong = document.querySelector("wrong");

// Defined by functions below
var timerCount;
var isWin = false;

let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let availableQuestions = []

// Based on 3 rounds of Gifs
let Questions = [
    {
        question:
        // string combo of gifs returned
        answer:
        // <line of code to populate word returned by wordsAPIcall>,
    },
    {
        question:
        // string combo of gifs returned
        answer:
        // <line of code to populate word returned by wordsAPIcall>,
    },
    {
        question:
        // string combo of gifs returned
        answer:
        // <line of code to populate word returned by wordsAPIcall>,
    }
]

//constants which tell us score increments by 10 and max number of gif rounds to run within time available = 3
const SCORE_POINTS = 10
const MAX_QUESTIONS = 3

function startTimer() {
    var timer = setInterval(function () {
        timerCount--;
        timerElement.textContent = timerCount;
        
        if (timerCount <= 0) {
            clearInterval(timer);
            //line to redirect to leaderboard and score
        }
    },1000);
}

startGame = () => {
    questionCounter = 0
    score = 0
    availableQuestions = [...questions]
    getNewQuestion()
    timerCount = 30;
    timerElement.textContent = timerCount;
    startTimer();
}

// return random word from a given list
function returnRandomWord(wordArray) {
    var randomIndex = Math.floor(Math.random()*wordArray.length)

    return wordArray[randomIndex];
}

// return a list of synonyms for thhe parsed word
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

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)
        //<place here line of code to return to 'start'>
    }

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion =   availableQuestions[questionsIndex]
    question.innerText = currentQuestion.question

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
    })

    availableQuestions.splice(questionsIndex, 1)

    acceptingAnswers = true 
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if(classToApply === 'correct') {
            incrementScore(SCORE_POINTS)
            timerCount = timerCount + 2;
        }

        if(classToApply === 'incorrect') {
            timerCount = timerCount - 2;
        }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()

        }, 200)

    })

})

incrementScore = num => {
    score +=num
    scoreText.innerText = score
}

startGame()
