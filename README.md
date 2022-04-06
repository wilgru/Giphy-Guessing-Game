# GIPHY GUESS GAME
## **Deployed web address**
https://wilgru.github.io/Group-F-Project-1-GIPHY-Guessing-Game/
<br>
<br>
## **Project Description**

A guessing game in which the user will guess the answer by typing a word in the input field which correlates with the GIFs populated (4 per round). 

Once the game rounds are generated, the countup timer begins, and the user's aim will be to complete 3 rounds as quickly as possible. 

On incorrect guesses, the user will be given a visual cue to reattempt the answer. On completion of 3 rounds of correct guesses, the game will be  over and the user will be able to save their name and time to the leaderboard. They will also be provided the option to play again.
<br>
<br>
## **Functionality / Technologies Used**

All the rounds are generated before the game starts. For each round being generated, a random word is selected, which is then used to get 4 random synonyms, which are then finally used to get 1 random gif each. The gifs and the original word are then stored as an object and then added to an array. This process is repeated until all the questions have been generated, and once its done, will begin the game.

1) Skeleton CSS Framework 
2) WordsAPI
3) GiphyAPI
4) HTML / CSS / JAVASCRIPT
<br>
<br>
![Alt Text](/assets/images/demo.png)
<br>
<br>
## **Installation and usage instructions**

1) Head to to https://wilgru.github.io/Group-F-Project-1-GIPHY-Guessing-Game/ and click on 'START GAME'. 

2) Review the GIFs and type the word that best describes all 4 gifs for the round, until all 3 rounds have been cleared. 

3) Save score by typing a username and clicking 'save'.

4) On the 'Scores' page, navigate home by clicking 'Home' button.  
<br>
<br>
## **Future Development**
Continuous play - Looking to build capacity to continue rendering limitless rounds without predefined number of rounds to load prior to game start. 

Complexity - Ability to return rounds associated with a particular theme of interest and ability to vary the number of gifs returned

Multiplayer - Ability for players to contribute to a common leaderboard and set words to return corresponding content for other players
<br>
<br>
## **Resources**
1) Link to Figma Wireframe for our APP https://www.figma.com/file/JKvK8ah0TkQyUfTk7HeRIl/Untitled?node-id=0%3A1
2) WordsAPI https://www.wordsapi.com/
3) Giphy API https://developers.giphy.com/docs/api
4) CSS framework http://getskeleton.com/
