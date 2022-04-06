// DOM vars
const headerEl = document.querySelector("header")
const btnStartElement = document.querySelector('[data-action="start"]');
const currentRoundEl = document.getElementById("current-round");
const topContainerEl = document.getElementById("top-container");
const tempMessageEl = document.getElementById("temp-message");
const loadingMessageEl = document.getElementById("loading-message");
const hint = document.getElementById("hint");
//timer DOM vars
const timerContainerEl = document.getElementById("timer-element");
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const endCount = localStorage.getItem('endCount');
// end game DOM vars
const userInput = document.getElementById("userGuess");
const swapFieldOne = document.getElementById("swap-one");
const swapFieldTwo = document.getElementById("swap-two");
const newFields = document.getElementById("final-username");
const ldrBrdBtnEl = document.getElementById("leaderboard-button");
const saveButtonEl = document.getElementById("lb-save-btn");

// end game saved user data vars
let savedUserData = [];
var user = {
  userName: "",
  score: ""
}

//image elements
var imageOneEl = document.getElementById("giphyImageOne");
var imageTwoEl = document.getElementById("giphyImageTwo");
var imageThreeEl = document.getElementById("giphyImageThree");
var imageFourEl = document.getElementById("giphyImageFour");

//Constant variables which define max number of gif rounds to run within time available = 3 for now as MVP)
const MAX_QUESTIONS = 3;
const NUM_OF_GIFS_PER_QUESTION = 4;
var WORDSAPI_API_KEY = API_KEYS.WORDS_API;
var GIPHY_API_KEY = API_KEYS.GIPHY_API;

//game vars
var questions = [];
var currentQuestion = 0;
var acceptingAnswers = true;
var incorrect = 0;
var timerTime = 0;
var interval;

//var for generating the questions at thhe start of the game only
var wordList = [
  "sleep",
  "excited",
  "angry",
  "happy",
  "sad",
  "eat",
  "lonely",
  "bread",
  "book",
  "baby",
  "person",
  "kind"
];
var excludeWordsList = [
  "well-chosen",
  "mad",
  "emotional",
  "frantic",
  "exhaust",
  "corrode",
  "rust",
  "run through",
  "use up",
  "volume",
  "spoil",
  "variety",
  "eternal rest",
  "eternal sleep",
  "bible",
  "christian bible",
  "good book",
  "holy scripture",
  "holy writ",
  "scripture",
  "word",
  "word of god",
  "rule book",
  "hold",
  "reserve",
  "al-qur'an",
  "koran",
  "quran",
  "record",
  "record book",
];
var generatedQuestions = [];
var currGenQuestionIndex = 0;
var currGenQuestionGifs = [];

// function that is called to start the game
function start () {
  timerContainerEl.style.display = "flex"
  userInput.style.display = "flex"

  interval = setInterval(incrementTimer, 1000);
  clearLoadingMessage();
  getNewQuestion();
  tempMessage("Start!", "green", "rgb(123, 202, 91)", renderCurrentRoundMessage);
};

//Populate countup timer display
function pad (number) {
  return number < 10 ? "0" + number : number;
};

// increment seconds upwards
function incrementTimer () {
  timerTime++;

  const numberMinutes = Math.floor(timerTime / 60);
  const numberSeconds = timerTime % 60;

  minutes.innerText = pad(numberMinutes);
  seconds.innerText = pad(numberSeconds);
};

// when called, will begin generating the questions
function generateQuestions() {
  renderLoadingMessage();
  headerEl.style.display = "none"

  console.log("<> Begin generating questions...");

  generatedQuestions = [];
  currGenQuestionGifs = [];
  currGenQuestionIndex = 0;
  addNextQuestion(); // start by adding the first question
}

// return random/s word from a given list
function returnRandomFromArray(wordsArray, num) {
  var randomIndex;
  var randomWord;

  if (num === 1) {
    while(randomWord === undefined) {
      randomIndex = Math.floor(Math.random() * wordsArray.length);
      randomWord = wordsArray[randomIndex]

      if (!excludeWordsList.includes(randomWord)) {
        return randomWord;
      }
    }

  } else {
    var randomWordList = [];

    while(randomWordList.length < num) {
      randomIndex = Math.floor(Math.random() * wordsArray.length);
      randomWord = wordsArray[randomIndex]

      if (!excludeWordsList.includes(randomWord)) {
        randomWordList.push(randomWord);
      } else {
        console.log("BAD SYNONYM. TRYING AGAIN...")
      }
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
    var arrayWithOgWord = synonymData.concat([word, word])
    var randomSynonyms = returnRandomFromArray(
      arrayWithOgWord,
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

// returns an array of gifs for the given synonym word, and an empty array returns, then get an array of gifs withh a fallback word
function getGifs(synonymWord, fallbackWord) {
  return fetch(
    "https://api.giphy.com/v1/gifs/search?api_key=" +
      GIPHY_API_KEY +
      "&q=" +
      synonymWord +
      "&limit=12&offset=0&rating=g&lang=en"
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
    console.log(""); // empty line 
    questions = generatedQuestions;
    start();
  }
}

// function to confirm endgame when max number of rounds reached
function checkEndOfGame() {
  if (currentQuestion === MAX_QUESTIONS) {
    clearInterval(interval);
    endTransition()
    tempMessage("Finished!", "green", "rgb(123, 202, 91)", renderCurrentEndOfGameMessage)
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
  removeCurrentRoundMessage()

  saveButtonEl.addEventListener("click", updateInfo);
}

// initiates updating array of user's data
// function that updates the new user data into existing array
function updateInfo() {
  tempMessage("Saved!", "green", "rgb(123, 202, 91)", renderCurrentEndOfGameMessage)
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

// clears all gifs off the screen
function clearScreen() {
  imageOneEl.src = "";
  imageTwoEl.src = "";
  imageThreeEl.src = "";
  imageFourEl.src = "";
}

// function to return another question and answer combo when user clears round
function getNewQuestion() {
  currentQuestion++;
  clearScreen();
  //renderGifs();
}

// display a message temporarily, and then displays another message when its done
function tempMessage(message, colour, bColour, postTempMessageFunc) {
  removeCurrentRoundMessage();
  tempMessageEl.textContent = message
  tempMessageEl.style.display = "block";
  tempMessageEl.style.color = colour;
  tempMessageEl.style.backgroundColor = bColour;

  setTimeout(() => {
    tempMessageEl.style.display = "none";
    postTempMessageFunc()
  }, 1000);
}

// display loading message
function renderLoadingMessage() {
  loadingMessageEl.style.display = "block";
}

// remove loading message
function clearLoadingMessage() {
  loadingMessageEl.style.display = "none";
}

// display current round
function renderCurrentRoundMessage() {
  currentRoundEl.style.display = "block";
  currentRoundEl.textContent = "Round: " + (currentQuestion + 1);
}

// removes current round message
function removeCurrentRoundMessage() {
  currentRoundEl.style.display = "none";
}

// display end of game message
function renderCurrentEndOfGameMessage() {
  currentRoundEl.style.display = "block";
  currentRoundEl.textContent = "Well done! Your time is:";
}

// function to return another question and answer combo when ruser clears round
function getNewQuestion() {
  tempMessage("Correct!", "green", "rgb(123, 202, 91)", renderCurrentRoundMessage);
  clearScreen();
  renderGifs();
  console.log("Psst! Round " + (currentQuestion + 1) + " Answer: '" + questions[currentQuestion].answer + "'")
}

// immediately gathers saved info to be ready for updating at end of game.
getUserInfo();

// EVENT LISTENERS ==============================================================================================
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

// user input handler, checks with user guess is correct/ incorrect
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    var userGuess = userInput.value;
    if (userGuess === questions[currentQuestion].answer) {
      userInput.value = "";
      currentQuestion++;

      incorrect = 0;
      hint.classList.add("hidden")
      checkEndOfGame();

    } else {
      tempMessage("Incorrect!", "darkred", "red", renderCurrentRoundMessage)
      userInput.value = "";

      incorrect++
      if (incorrect >= 3) {
        hint.classList.remove("hidden")
      }

      userInput.style.boxShadow = "0px 0px 10px red";
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
