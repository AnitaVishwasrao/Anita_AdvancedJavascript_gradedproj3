var TIME_LIMIT = 60;

const quotes = [
  "Try not. Do or do not. There is no try.",
  "Train yourself to let go of everything you fear to lose.",
  "Difficult to see; always in motion is the future.",
  "You are never too old to set another goal or to dream a new dream.",
  "In a dark place we find ourselves and a little more knowledge lights our way.",
  "Fear leads to anger, anger leads to hate, hate leads to suffering.",
];

const errorCountElement = document.querySelector("#error");
const remainingTimeElement = document.querySelector("#remaining-time");
const perAccuracyElement = document.querySelector("#per-accuracy");
const gameMsgElement = document.querySelector("#game-msg");
const typingAreaElement = document.querySelector("#typing-area");
const restartBtnElement = document.querySelector(".restart");
const wpmWrapperElement = document.querySelector(".wpm-wrapper");
const cpmWrapperElement = document.querySelector(".cpm-wrapper");
const wpmElement = wpmWrapperElement.querySelector("#wpm");
const cpmElement = cpmWrapperElement.querySelector("#cpm");

const gameSettings = {
  remainingTime: TIME_LIMIT,
  timeElapsed: 0,
  errorCount: 0,
  perAccuracy: 0,
  wordCount: 0,
  currentQuoteIndex: -1,
  totalChars: 0,
  totalWords: 0,
  typedText: "",
  totalErrors: 0,
  currentQuote: "",
  defaultGameMsg: "Click on the area below to start the game.",
  gameOverMsg: "Click on restart to start a new game.",
  timer: 0,
};

var {
  remainingTime,
  timeElapsed,
  errorCount,
  perAccuracy,
  wordCount,
  currentQuoteIndex,
  totalChars,
  totalWords,
  typedText,
  totalErrors,
  currentQuote,
  defaultGameMsg,
  gameOverMsg,
  timer,
} = gameSettings;

function getQuote() {
  currentQuoteIndex = (++currentQuoteIndex) % quotes.length;
  currentQuote = quotes[currentQuoteIndex];
  return currentQuote;
}

function showQuote() {
  let quote = getQuote();
  let quoteText = "";

  for (let char of quote) {
    quoteText += `<span>${char}</span>`;
  }
  gameMsgElement.innerHTML = quoteText;
}

function getWordCount(text) {
  return text !== "" ? text.split(" ").length : 0;
}

function getCharCount(text) {
  return text.length;
}

function calculateAndSetPerAccuracy(charCount, currentErrors) {
  let correctChars = charCount - currentErrors;
  let accuracy = (correctChars / charCount) * 100;
  perAccuracy = Math.round(accuracy);
  perAccuracyElement.innerText = perAccuracy;
}

function processTypedText() {
  //Ignored backspace characters

  typedText = typingAreaElement.value;
  typedCharArray = typedText.split("");
  errorCount = 0;

  let charCount = totalChars + typedCharArray.length;

  let spanElements = gameMsgElement.querySelectorAll("span");
  spanElements.forEach((char, index) => {

    let spanChar = char.innerText;
    let typedChar = typedCharArray[index];

    if (typedChar == null) {
      char.classList.remove("incorrect_char");
      char.classList.remove("correct_char");
    } else if (typedChar === spanChar) {
      char.classList.remove("incorrect_char");
      char.classList.add("correct_char");
    } else {
      char.classList.add("incorrect_char");
      char.classList.remove("correct_char");
      errorCount++;
    }

  });

  let currentErrors = totalErrors + errorCount;
  errorCountElement.innerText = currentErrors;

  calculateAndSetPerAccuracy(charCount, currentErrors);

  if (typedText.length == currentQuote.length) {
    totalWords += getWordCount(typedText);
    totalChars += getCharCount(typedText);
    showQuote();
    totalErrors += errorCount;
    typingAreaElement.value = "";
  }

  typedText = "";
  typedCharArray = "";
}

function endGame() {
  typedText = typingAreaElement.value;
  typingAreaElement.disabled = true;

  gameMsgElement.innerText = gameOverMsg;

  totalWords += getWordCount(typedText);
  totalChars += getCharCount(typedText);

  let cpm = Math.round((totalChars / timeElapsed) * 60);

  cpmElement.innerText = cpm;
  wpmElement.innerText = totalWords;

  cpmWrapperElement.classList.remove("display-none");
  cpmWrapperElement.classList.add("display-block");

  wpmWrapperElement.classList.remove("display-none");
  wpmWrapperElement.classList.add("display-block");

  restartBtnElement.classList.remove("display-none");
  restartBtnElement.classList.add("display-block");

}

function updateTimer() {
  if (remainingTime > 0) {
    remainingTime--;
    timeElapsed++;
    remainingTimeElement.innerText = remainingTime + "s";
  } else {
    endGame();
    resetTimer();
  }
}

function startGame() {
  restartGame();
  showQuote();
  timer = setInterval(updateTimer, 1000);
}

function restartGame() {
  remainingTime = TIME_LIMIT;
  timeElapsed = 0;
  errorCount = 0;
  perAccuracy = 100;
  wordCount = 0;
  currentQuoteIndex = -1;
  totalChars = 0;
  typedText = "";
  totalErrors = 0;
  currentQuote = "";
  totalWords = 0;

  gameMsgElement.innerText = defaultGameMsg;
  wpmElement.innerText = totalWords;
  cpmElement.innerText = 0;
  errorCountElement.innerText = errorCount;
  remainingTimeElement.innerText = "60s";
  perAccuracyElement.innerText = perAccuracy;

  wpmWrapperElement.classList.add("display-none");
  wpmWrapperElement.classList.remove("display-block");

  cpmWrapperElement.classList.add("display-none");
  cpmWrapperElement.classList.remove("display-block");

  restartBtnElement.classList.add("display-none");
  restartBtnElement.classList.remove("display-block");


  resetTimer()
  typingAreaElement.value = "";
  typingAreaElement.disabled = false;
}


function resetTimer() {
  if (timer) {
    clearInterval(timer);
  }
}