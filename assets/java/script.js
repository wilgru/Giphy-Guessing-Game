// Handles timer on clicking 'START GAME'
const btnStartElement = document.querySelector('[data-action="start"]');
const currentRoundEl = document.getElementById("current-round");
const topContainerEl = document.getElementById("top-container");
const startMessageEl = document.getElementById("start-message");
const loadingMessageEl = document.getElementById("loading-message");
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const endCount = localStorage.getItem('endCount');
let savedUserData = [];
let timerTime = 0;
let interval;

//Continues to call function every second
const start = () => {
  isRunning = true;
  interval = setInterval(incrementTimer, 1000);
  clearLoadingMessage();
  getNewQuestion();
  startMessage("Start!", "green", "rgb(123, 202, 91)");
};

//Populate countup timer display
const pad = (number) => {
  return number < 10 ? "0" + number : number;
};

//Icrement seconds upwards
const incrementTimer = () => {
  timerTime++;

  const numberMinutes = Math.floor(timerTime / 60);
  const numberSeconds = timerTime % 60;

  minutes.innerText = pad(numberMinutes);
  seconds.innerText = pad(numberSeconds);
};

//begins game on click
btnStartElement.addEventListener(
  "click",
  (startTimer = () => {
    generateQuestions();
  })
);

//disables start button on click
btnStartElement.addEventListener("click", function (event) {
  event.target.style.display = "none";
});

//Constants which define max number of gif rounds to run within time available = 3 for now as MVP)
const MAX_QUESTIONS = 3;
const NUM_OF_GIFS_PER_QUESTION = 4;
const WORDSAPI_API_KEY = API_KEYS.WORDS_API;
const GIPHY_API_KEY = API_KEYS.GIPHY_API;

//game vars
var questions = [];
var currentQuestion = 0;
var acceptingAnswers = true;
var userInput = document.getElementById("userGuess");
var swapFieldOne = document.getElementById("swap-one");
var swapFieldTwo = document.getElementById("swap-two");
var newFields = document.getElementById("final-username");
var ldrBrdBtnEl = document.getElementById("leaderboard-button");

//image elements

var imageOneEl = document.getElementById("giphyImageOne");
var imageTwoEl = document.getElementById("giphyImageTwo");
var imageThreeEl = document.getElementById("giphyImageThree");
var imageFourEl = document.getElementById("giphyImageFour");

//var for generating the questions at thhe start of the game only
var wordList = [
  "celebrate",
  "excited",
  "scary",
  "curious",
  "hot",
  "cold",
  "bored",
  "angry",
  "happy",
  "sad",
  "tired"
];
var generatedQuestions = [];
var currGenQuestionIndex = 0;
var currGenQuestionGifs = [];

var user = {
  userName: "",
  score: ""
}

// immediately gathers saved info to be ready for updating at end of game.
getUserInfo();

// whenn called, will begin generating the questions
function generateQuestions() {
  renderLoadingMessage();

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
    var wordsArrayCopy = wordsArray.slice(0);
    for (let i = 0; i < num; i++) {
      randomIndex = Math.floor(Math.random() * wordsArrayCopy.length);
      randomWordList.push(wordsArrayCopy[randomIndex]);
      wordsArrayCopy.splice(randomIndex, 1);
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

// function to confirm endgame when max number of rounds reached
function checkEndOfGame() {
  if (generatedQuestions.length === 0 || currentQuestion === MAX_QUESTIONS) {
    clearInterval(interval);
    endTransition()
  }else {
    getNewQuestion()
  }
}

// function that prepares users for end-game sequence
function endTransition() {
  var endGameEl = document.getElementById("end-game");

  endGameEl.classList.remove("hidden");
  ldrBrdBtnEl.classList.remove("hidden");
  swapFieldOne.classList.add("hidden");
  swapFieldTwo.classList.add("hidden");
  userInput.classList.add("hidden");
  
  userInput.style.display = "none";

  // initiates updating array of user's data
  newFields.addEventListener("keypress", function (e){
    if (e.key === "Enter") {
      updateInfo()
    }
  });
}

// function that updates the new user data into existing array
function updateInfo() {
  user.userName += newFields.value;
  user.score += timerTime;
  if (!userInfoArray) {
    savedUserData.push(user);
    console.log(savedUserData);
  } else {
    userInfoArray.push(user);
    console.log(user);
  }
  saveEndCount()
}

// function to save timercount timestamp to local storage
function saveEndCount() {
  if (!userInfoArray) {
    localStorage.setItem("savedUserData", JSON.stringify(savedUserData));
    console.log(savedUserData);
  } else {
    localStorage.setItem("savedUserData", JSON.stringify(userInfoArray));
    console.log(userInfoArray);
  }
}

// function to prepare saved info for updating at end of game
function getUserInfo() {
  userInfoArray = JSON.parse(localStorage.getItem("savedUserData"));
  console.log(userInfoArray);
}

// function to return gifs and populate placeholders based on getSynonyms()
function renderGifs() {
  imageOneEl.src = questions[currentQuestion].gifUrls[0];
  imageTwoEl.src = questions[currentQuestion].gifUrls[1];
  imageThreeEl.src = questions[currentQuestion].gifUrls[2];
  imageFourEl.src = questions[currentQuestion].gifUrls[3];
}

//
function clearScreen() {
  imageOneEl.src = "";
  imageTwoEl.src = "";
  imageThreeEl.src = "";
  imageFourEl.src = "";
}

// display loading message
function renderLoadingMessage() {
  loadingMessageEl.style.display = "block";
}

// function to return another question and answer combo when ruser clears round
function getNewQuestion() {
  currentQuestion++;
  clearScreen();
  //renderGifs();
}

// remove loading message
function clearLoadingMessage() {
  loadingMessageEl.style.display = "none";
}

// display start! message
function startMessage(message, colour, bColour) {
  removeCurrentRoundMessage();
  startMessageEl.textContent = message
  startMessageEl.style.display = "block";
  startMessageEl.style.color = colour;
  startMessageEl.style.backgroundColor = bColour;

  setTimeout(() => {
    startMessageEl.style.display = "none";
    renderCurrentRoundMessage();
  }, 1000);
}

// display current round
function renderCurrentRoundMessage() {
  currentRoundEl.style.display = "block";
  currentRoundEl.textContent = "Round: " + (currentQuestion + 1);
}

function removeCurrentRoundMessage() {
  currentRoundEl.style.display = "none";
}

// function to return another question and answer combo when ruser clears round
function getNewQuestion() {
  startMessage("Correct!", "green", "rgb(123, 202, 91)");
  clearScreen();
  renderGifs();
}

// user input handler, checks with user guess is correct/ incorrect
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    var userGuess = userInput.value;
    if (userGuess === questions[currentQuestion].answer) {
      console.log("correct");
      userInput.value = "";
      currentQuestion++;
      checkEndOfGame();
    } else {
      startMessage("Incorrect!", "darkred", "red")
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
