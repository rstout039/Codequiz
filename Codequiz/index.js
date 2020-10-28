// variables to keep track of quiz state //
var currentQuestionIndex = 0;
var time = questions.length * 8;
var timerId;

// variables to reference DOM elements //
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");

// sound effects //
sfxRight = new Audio("https://youtu.be/xg9ebVTL9yE?t=60")
sfxWrong = new Audio("https://youtu.be/RpkQEq75y18?t=6")

function startQuiz() {
    // hide start screen //
    var startScreenEl = document.getElementById("start-screen");
    startScreenEl.setAttribute("class", "hide");

    // unhide questions section //
    questionsEl.removeAttribute("class");

    // start timer //
    timerId = setInterval(clockTick, 1000);
    
    // show starting time //
    timerEl.textContent = time;

    getQuestion();
}

function getQuestion() {
    // get questions from array //
    var currentQuestion = questions[currentQuestionIndex];
    // update title with current question //
    var titleEl = document.getElementById("question-title");
    titleEl.textContent = currentQuestion.title;
    
    // clear out old question choices //
    choicesEl.innerHTML = "";

    // loop over choices //
    currentQuestion.choices.forEach(function(choices, i){
        // create new button fvor each choice //
        var choiceNode = document.createElement("button");
        choiceNode.setAttribute("class", "choices");
        choiceNode.setAttribute("value", choices);

        choiceNode.textContent = i + 1 + ". " + choices;
        // attach click event listener to each choice //
        choiceNode.onclick = questionClick;

        // display on the page //
        choicesEl.appendChild(choiceNode);
    });
}

function questionClick() {
    // check if user guessed wrong //
    if(this.value !== questions[currentQuestionIndex].answer){
        // penalize time //
        time-= 15;
        if(time < 0){
            time = 0;
        }
        // display new time on page //
        timerEl.textContent = time;

        //play wrong sound effect//
        sfxWrong.play();

        feedbackEl.textContent = "Wrong";
    }
    else{
        // play right sound effect//
        sfxRight.play();

        feedbackEl.textContent = "Correct"
    }

    // flash right/wrong feedback on page //
    feedbackEl.setAttribute("class", "feedback");
    setTimeout(function() {
        feedbackEl.setAttribute("class", "feedback hide");
    }, 1000);
    // move to next question //
    currentQuestionIndex++;

    // check if we ran out of questions //
    if(currentQuestionIndex === questions.length) {
        quizEnd();
    } else {
        getQuestion();
    }
}

function quizEnd(){
    // stop timer //
    clearInterval(timerId);

    // show end screen //
    var endScreenEl = document.getElementById("end-screen");
    endScreenEl.removeAttribute("class");

    // show final score //
    var finalScoreEl = document.getElementById("final-score");
    finalScoreEl.textContent = time;

    // hide questions section //
    questionsEl.setAttribute("class", "hide");
}

function clockTick() {
    // update time //
    time--;
    timerEl.textContent = time;

    // check if user ran out of time //
    if(time <= 0) {
        quizEnd();
    }
}

function saveHighScore() {
    // get value of input box //
    var initials = initialsEl.value.trim();

    // make sure value was not empty //
    if(initials !== ""){
        // get saved scores from strorage or keep in empty array //
        var highscores =
         JSON.parse(windows.localStorage.getItem("highscores")) || [];

        // format new score object for current user //
        var newScore = {
            score: time,
            initials: initials,
        }

        // save to local storage //
        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));

        // redirect to next page //
        window.location.href = "highscores.html";
    }
}

function checkForEnter(event) {
    // "13" represents the enter key //
    if(event.key === "Enter"){
        saveHighScore();
    }
}
//use click button to submit initals //
submitBtn.onclick = saveHighScore;

//use click button to start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;
