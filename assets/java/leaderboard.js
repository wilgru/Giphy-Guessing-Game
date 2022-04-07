leaderBoardEl = document.getElementById("leader-board-content");
savedUserData = JSON.parse(localStorage.getItem("savedUserData"));

renderLeaderboard();

// takes the savedUserData and immediately formats it to the leaderboard
function renderLeaderboard() {
    savedUserData.forEach(function (index) {
        var checkedName
        if (index.userName === "") {
            checkedName = "<i>[anonymous]</i>"
        } else {
            checkedName = index.userName
        }

        leaderBoardEl.innerHTML += 
        `<div class="six columns score-card">${checkedName}</div>
        <div class="six columns score-card">${index.score}</div>`
    });
}