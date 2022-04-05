leaderBoardEl = document.getElementById("leader-board-content");
savedUserData = JSON.parse(localStorage.getItem("savedUserData"));

renderLeaderboard();

// takes the savedUserData and immediately formats it to the leaderboard
function renderLeaderboard() {
    savedUserData.forEach(function (index) {
        leaderBoardEl.innerHTML += 
        `<div class="six columns score-card">${index.userName}</div>
        <div class="six columns score-card">${index.score}</div>`
    });
}