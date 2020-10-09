function printHighScores(){
    // either get scores from storage or set to empty array //
    var highscores = JSON.parse(window.localStorage.getItem("highscores"));

    // sort highscores in descending order //
    highscores.sort(function(a, b) {
        return b.score - a.score;
    });
    highscores.forEach(function(score) {
        // create li tage for each score //
        var liTag = document.getElementById("li");
        liTag.textContent = score.initials + "-" + score.score;

        // display on page //
        var olEl = document.getElementById("highscores");
        olEl.appendChild(liTag);
    });
}

function clearHighScores() {
    window.localStorage.removeItem("highscores");
    window.location.reload();
}

document.getElementById("clear").onclick = clearHighScores;

// run function when page loads //
printHighScores();
