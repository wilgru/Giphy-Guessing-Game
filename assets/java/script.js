//Constants which force score increments by 10 and max number of gif rounds to run within time available = 3 for now as MVP)
const SCORE_POINTS = 10;
const MAX_QUESTIONS = 3;
const NUM_OF_GIFS_PER_QUESTION = 4;
const WORDSAPI_API_KEY = API_KEYS.WORDS_API;
const GIPHY_API_KEY = API_KEYS.GIPHY_API;

//game vars
var questions = [];
var currentQuestion = 0;
var acceptingAnswers = true;
var gameTimer = 0;
var userInput = document.getElementById("userGuess");

//image elements

var imageOneEl = document.getElementById("giphyImageOne");
var imageTwoEl = document.getElementById("giphyImageTwo");
var imageThreeEl = document.getElementById("giphyImageThree");
var imageFourEl = document.getElementById("giphyImageFour");

//var for generating the questions at thhe start of the game only
var wordList = [
  "chair",
  "car",
  "house",
  "animal",
  "book",
  "machine",
  "trash",
  "baby",
  "land",
];
var generatedQuestions = [];
var currGenQuestionIndex = 0;
var currGenQuestionGifs = [];

// whenn called, will begin generating the questions
function generateQuestions() {
  disableStartGameButton();

  console.log("<> Begin generating questions...");

  generatedQuestions = [];
  currGenQuestionGifs = [];
  currGenQuestionIndex = 0;
  addNextQuestion(); // start by adding the first question
}

// return random/s word from a given list
function returnRandomFromArray(wordsArray, num) {
  var randomIndex;

  if (num === 1) {
    randomIndex = Math.floor(Math.random() * wordsArray.length);
    return wordsArray[randomIndex];
  } else {
    var randomWordList = [];

    for (let i = 0; i < num; i++) {
      randomIndex = Math.floor(Math.random() * wordsArray.length);
      randomWordList.push(wordsArray[randomIndex]);
    }
    return randomWordList;
  }
}

// return a list of synonyms for thhe parsed word
function getSynonyms(word) {
  return fetch(
    "https://wordsapiv1.p.rapidapi.com/words/" + word + "/synonyms",
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
        "X-RapidAPI-Key": WORDSAPI_API_KEY,
      },
    }
  )
    .then((response) => response.json()) // convert response to json
    .then((data) => data.synonyms) // return the list of synonyms
    .catch((err) => console.error(err)); // consol log error if any
}

// returns a random gif url from a given list of urls
function returnRandomGifUrl(gifArray, fallBackWord) {
  var randomIndex = Math.floor(Math.random() * gifArray.length);

  if (gifArray.length > 0) {
    return gifArray[randomIndex].images.original.url;
  } else {
    return "NO_GIFS_FOUND";
  }
}

// fetch gifs from giphyAPI, and store 4 random gifs into the current question that is being generated
function setGifs(word) {
  getSynonyms(word).then((synonymData) => {
    var randomSynonyms = returnRandomFromArray(
      synonymData,
      NUM_OF_GIFS_PER_QUESTION
    );

    // set the gifs for the question currently being generated
    for (let i = 0; i < randomSynonyms.length; i++) {
      getGifs(randomSynonyms[i], word).then((gifData) => {
        var randomGifUrl = returnRandomGifUrl(gifData, word);

        currGenQuestionGifs.push(randomGifUrl);
      });
    }

    checkQuestionPopulation();
  });
}

//
function getGifs(synonymWord, fallbackWord) {
  return fetch(
    "https://api.giphy.com/v1/gifs/search?api_key=" +
      GIPHY_API_KEY +
      "&q=" +
      synonymWord +
      "&limit=4&offset=0&rating=g&lang=en"
  )
    .then((response) => response.json())
    .then((gifData) => {
      // if giphy cant return a gif for the given random synonym, then just get a gif using the origional word (which should guarnetee a returned value)
      if (gifData.data.length === 0) {
        console.log("NO GIFS FOUND - RETURNING FALLBACK");
        return fetch(
          "https://api.giphy.com/v1/gifs/search?api_key=" +
            GIPHY_API_KEY +
            "&q=" +
            fallbackWord +
            "&limit=4&offset=0&rating=g&lang=en"
        )
          .then((response) => response.json())
          .then((fallbackGifData) => {
            return fallbackGifData.data;
          });

        // else return the gif data for the synonym word given since there were no problems with it
      } else {
        console.log(gifData.data);
        return gifData.data;
      }
    });
}

//check if the currGenQuestionGifs has been fully populated, and once it has been, move on to the next question
function checkQuestionPopulation() {
  checkInterval = setInterval(() => {
    if (currGenQuestionGifs.length === NUM_OF_GIFS_PER_QUESTION) {
      clearInterval(checkInterval);

      console.log("Question No." + currGenQuestionIndex + " - COMPLETE");
      generatedQuestions[currGenQuestionIndex]["gifUrls"] = currGenQuestionGifs;
      currGenQuestionIndex++;
      addNextQuestion();
    }
    // else {
    //     console.log('Loading Gifs for Question No.'+ currGenQuestionIndex + " - " + currGenQuestionGifs.length + "/4")
    // }
  }, 100);
}

//strt working on the next question to add to the list of questions
function addNextQuestion() {
  if (currGenQuestionIndex < MAX_QUESTIONS) {
    console.log("Generating question #" + currGenQuestionIndex + "...");

    generatedQuestions[currGenQuestionIndex] = {};
    generatedQuestions[currGenQuestionIndex].answer = returnRandomFromArray(
      wordList,
      1
    );
    currGenQuestionGifs = [];

    setGifs(generatedQuestions[currGenQuestionIndex].answer);
  } else {
    console.log("<> Questions fully generated. starting game...");
    questions = generatedQuestions;
    start();
  }
}

// Handles timer on clicking 'START GAME'
function startTimer() {
  setInterval(function () {
    gameTimer++;
    if (gameTimer >= 0) {
      span = document.getElementById("timer-element");
      span.innerHTML = ("0" + gameTimer).slice(-2);
    }
  }, 1000);
}

// start game function
function start() {
  startTimer();
  getNewQuestion();
}

// function to return gifs and populate placeholders based on getSynonyms()
function renderGifs() {
  imageOneEl.src = currGenQuestionGifs[0];
  imageTwoEl.src = currGenQuestionGifs[1];
  imageThreeEl.src = currGenQuestionGifs[2];
  imageFourEl.src = currGenQuestionGifs[3];
}

//
function clearScreen() {
  imageOneEl.src = "";
  imageTwoEl.src = "";
  imageThreeEl.src = "";
  imageFourEl.src = "";
}

//
function disableStartGameButton() {}

//
function setLocalStorage() {}

//
function checkEndOfGame() {}

// function to return another question and answer combo when ruser clears round
function getNewQuestion() {
  currentQuestion++;
  clearScreen();
  //renderGifs();
}

// user input handler, checks with user guess is correct/ incorrect
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    var userGuess = userInput.value;
    if (userGuess === questions[currentQuestion].answer) {
      console.log("correct");
      userGuess = "";
      getNewQuestion();

      //incorrect guess
    } else {
      userInput.style.boxShadow = "0px 0px 10px red";
      userInput.value = "";
      var countDown = 1;
      var removeRedBorder = setInterval(function () {
        countDown--;
        if (countDown <= 0) {
          userInput.style.boxShadow = "0px 0px 0px ";
          clearInterval(removeRedBorder);
        }
      }, 500);
    }
  }
});
