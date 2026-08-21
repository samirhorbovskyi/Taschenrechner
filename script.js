const currentDisplay = document.getElementById("current-operation");
const previousDisplay = document.getElementById("previous-operation");

let currentValue = "0";
let previousValue = "";
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  currentDisplay.textContent = currentValue;
  previousDisplay.textContent =
    operator && previousValue
      ? `${previousValue} ${getOperatorSymbol(operator)}`
      : "";
}

function getOperatorSymbol(operator) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
  };

  return symbols[operator];
}

function inputNumber(number) {
  if (currentValue === "0" || shouldResetDisplay) {
    currentValue = number;
    shouldResetDisplay = false;
  } else {
    currentValue += number;
  }

  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentValue = "0.";
    shouldResetDisplay = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }

  updateDisplay();
}

function chooseOperator(selectedOperator) {
  if (operator && !shouldResetDisplay) {
    calculate();
  }

  previousValue = currentValue;
  operator = selectedOperator;
  shouldResetDisplay = true;

  updateDisplay();
}

function calculate() {
  if (!operator || previousValue === "") return;

  const previous = parseFloat(previousValue);
  const current = parseFloat(currentValue);

  let result;

  switch (operator) {
    case "+":
      result = previous + current;
      break;

    case "-":
      result = previous - current;
      break;

    case "*":
      result = previous * current;
      break;

    case "/":
      if (current === 0) {
        currentValue = "Error";
        previousValue = "";
        operator = null;
        shouldResetDisplay = true;
        updateDisplay();
        return;
      }

      result = previous / current;
      break;
  }

  currentValue = Number(result.toFixed(10)).toString();
  previousValue = "";
  operator = null;
  shouldResetDisplay = true;

  updateDisplay();
}

function clearCalculator() {
  currentValue = "0";
  previousValue = "";
  operator = null;
  shouldResetDisplay = false;

  updateDisplay();
}

function deleteLastCharacter() {
  if (shouldResetDisplay || currentValue === "Error") return;

  if (currentValue.length === 1) {
    currentValue = "0";
  } else {
    currentValue = currentValue.slice(0, -1);
  }

  updateDisplay();
}

function calculatePercent() {
  if (currentValue === "Error") return;

  currentValue = (parseFloat(currentValue) / 100).toString();
  updateDisplay();
}

document.querySelectorAll("[data-number]").forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.number;

    if (value === ".") {
      inputDecimal();
    } else {
      inputNumber(value);
    }
  });
});

document.querySelectorAll("[data-operator]").forEach(button => {
  button.addEventListener("click", () => {
    chooseOperator(button.dataset.operator);
  });
});

document
  .querySelector('[data-action="calculate"]')
  .addEventListener("click", calculate);

document
  .querySelector('[data-action="clear"]')
  .addEventListener("click", clearCalculator);

document
  .querySelector('[data-action="delete"]')
  .addEventListener("click", deleteLastCharacter);

document
  .querySelector('[data-action="percent"]')
  .addEventListener("click", calculatePercent);

document.addEventListener("keydown", event => {
  if (!isNaN(event.key)) {
    inputNumber(event.key);
  }

  if (event.key === ".") {
    inputDecimal();
  }

  if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  }

  if (event.key === "Enter" || event.key === "=") {
    calculate();
  }

  if (event.key === "Backspace") {
    deleteLastCharacter();
  }

  if (event.key === "Escape") {
    clearCalculator();
  }
});

updateDisplay();