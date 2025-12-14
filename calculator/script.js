let currentInput = "";
let lastAnswer = 0;

const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

function updateDisplay() {
  expressionDisplay.textContent = currentInput || "";
  if (currentInput === "") {
    resultDisplay.textContent = "0";
  }
}

function insertChar(char) {
  currentInput += char;
  updateDisplay();
}

function clearDisplay() {
  currentInput = "";
  resultDisplay.textContent = "0";
  expressionDisplay.textContent = "";
}

function backspace() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (currentInput === "") return;

  try {
    let expression = currentInput;
    expression = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");

    let result = eval(expression);

    if (!isFinite(result)) {
      resultDisplay.textContent = "Error";
      return;
    }

    result = Math.round(result * 100000000) / 100000000;
    lastAnswer = result;
    resultDisplay.textContent = result;
    expressionDisplay.textContent = currentInput;
    currentInput = "";
  } catch (error) {
    resultDisplay.textContent = "Error";
  }
}

function answer() {
  currentInput += lastAnswer.toString();
  updateDisplay();
}

function squareRoot() {
  if (currentInput === "") {
    currentInput = Math.sqrt(lastAnswer).toString();
  } else {
    try {
      let expression = currentInput
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");
      let value = eval(expression);
      currentInput = Math.sqrt(value).toString();
    } catch (error) {
      resultDisplay.textContent = "Error";
      return;
    }
  }
  updateDisplay();
  calculate();
}

function plusMinus() {
  if (currentInput === "") {
    currentInput = (-lastAnswer).toString();
  } else {
    try {
      let expression = currentInput
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");
      let value = eval(expression);
      currentInput = (-value).toString();
    } catch (error) {
      if (currentInput.startsWith("-")) {
        currentInput = currentInput.substring(1);
      } else {
        currentInput = "-" + currentInput;
      }
    }
  }
  updateDisplay();
}

document.addEventListener("keydown", function (event) {
  if (event.key >= "0" && event.key <= "9") {
    insertChar(event.key);
  } else if (event.key === ".") {
    insertChar(".");
  } else if (
    event.key === "+" ||
    event.key === "-" ||
    event.key === "*" ||
    event.key === "/"
  ) {
    insertChar(event.key);
  } else if (event.key === "Enter") {
    calculate();
  } else if (event.key === "Backspace") {
    backspace();
  } else if (event.key === "Escape") {
    clearDisplay();
  }
});

updateDisplay();
