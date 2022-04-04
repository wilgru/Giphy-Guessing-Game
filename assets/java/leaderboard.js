leaderBoardEl = document.getElementById("leader-board-content");

function init() {
    getLocalstorage() // first get all data in local storage
    renderLeaderboard() // then render thhat data to the HTML page
}

// gets everything in local storage and stores it into the leaderboardArray variable
function getLocalstorage () {
    JSON.parse(localStorage.getItem(user)).then(data => {
        console.log(data);
        renderLeaderboard(data);
    })
}

// 
function renderLeaderboard(data) {
    let {userName, score} = data;

    data.forEach((idx) => {
        if (idx === 0) {
            leaderBoardEl.innerHTML = 
            `<div class="six columns score-card">${userName}</div>
            <div class="six columns score-card">${score}</div>`
        }
    })    
}