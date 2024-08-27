const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    memory: 0
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
    calculator.displayValue = waitingForSecondOperand ? digit : displayValue === '0' ? digit : displayValue + digit;
    calculator.waitingForSecondOperand = false;
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand) return;
    if (!calculator.displayValue.includes(dot)) calculator.displayValue += dot;
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand,
    '%': (firstOperand) => firstOperand / 100,
    'sqrt': (firstOperand) => Math.sqrt(firstOperand),
    '^': (firstOperand, secondOperand) => Math.pow(firstOperand, secondOperand),
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function handleBackspace() {
    calculator.displayValue = calculator.displayValue.slice(0, -1) || '0';
}

function handleMemory(key) {
    const { displayValue } = calculator;
    const value = parseFloat(displayValue);

    switch (key) {
        case 'MC':
            calculator.memory = 0;
            break;
        case 'MR':
            calculator.displayValue = calculator.memory.toString();
            break;
        case 'M+':
            calculator.memory += value;
            break;
        case 'M-':
            calculator.memory -= value;
            break;
    }

    updateDisplay();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.calculator').classList.toggle('dark-mode');
    document.querySelector('.calculator-screen').classList.toggle('dark-mode');
    document.querySelectorAll('button').forEach(button => button.classList.toggle('dark-mode'));
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('backspace')) {
        handleBackspace();
        updateDisplay();
        return;
    }

    if (target.classList.contains('memory')) {
        handleMemory(target.value);
        return;
    }

    if (target.classList.contains('toggle-theme')) {
        toggleTheme();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});
