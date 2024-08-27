const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    memory: 0,
    rounding: true,
    vibration: false,
    history: [],
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
    calculator.displayValue = waitingForSecondOperand ? digit : displayValue === '0' ? digit : displayValue + digit;
    calculator.waitingForSecondOperand = false;
    updateDisplay();
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand) return;
    if (!calculator.displayValue.includes(dot)) calculator.displayValue += dot;
    updateDisplay();
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        calculator.displayValue = calculator.rounding ? `${parseFloat(result.toFixed(7))}` : `${result}`;
        calculator.firstOperand = result;
        calculator.history.push(`${firstOperand} ${operator} ${inputValue} = ${result}`);
        updateHistory();
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    updateDisplay();
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => secondOperand === 0 ? 'Error' : firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand,
    '%': (firstOperand, secondOperand) => firstOperand * secondOperand / 100,
    sqrt: (firstOperand) => firstOperand < 0 ? 'Error' : Math.sqrt(firstOperand),
    pow: (firstOperand, secondOperand) => Math.pow(firstOperand, secondOperand),
    mod: (firstOperand, secondOperand) => firstOperand % secondOperand,
    ceil: (firstOperand) => Math.ceil(firstOperand),
    floor: (firstOperand) => Math.floor(firstOperand),
    sin: (firstOperand) => Math.sin(toRadians(firstOperand)),
    cos: (firstOperand) => Math.cos(toRadians(firstOperand)),
    tan: (firstOperand) => Math.tan(toRadians(firstOperand)),
    asin: (firstOperand) => toDegrees(Math.asin(firstOperand)),
    acos: (firstOperand) => toDegrees(Math.acos(firstOperand)),
    atan: (firstOperand) => toDegrees(Math.atan(firstOperand)),
    log: (firstOperand) => firstOperand <= 0 ? 'Error' : Math.log10(firstOperand),
    ln: (firstOperand) => firstOperand <= 0 ? 'Error' : Math.log(firstOperand),
    exp: (firstOperand) => Math.exp(firstOperand),
    abs: (firstOperand) => Math.abs(firstOperand),
    factorial: (firstOperand) => {
        if (firstOperand < 0 || !Number.isInteger(firstOperand)) return 'Error';
        return factorial(firstOperand);
    },
    rad: (firstOperand) => toRadians(firstOperand),
    deg: (firstOperand) => toDegrees(firstOperand),
};

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function handleMemory(action) {
    const { displayValue } = calculator;
    const value = parseFloat(displayValue);

    switch (action) {
        case 'MC':
            calculator.memory = 0;
            break;
        case 'MR':
            calculator.displayValue = `${calculator.memory}`;
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

function handleBackspace() {
    calculator.displayValue = calculator.displayValue.slice(0, -1) || '0';
    updateDisplay();
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    updateDisplay();
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function updateHistory() {
    const historyList = document.querySelector('.history-list');
    historyList.innerHTML = calculator.history.map(entry => `<li>${entry}</li>`).join('');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.calculator').classList.toggle('dark-mode');
    document.querySelector('.calculator-screen').classList.toggle('dark-mode');
    document.querySelectorAll('button').forEach(button => button.classList.toggle('dark-mode'));
}

function toggleRounding() {
    calculator.rounding = !calculator.rounding;
}

function toggleVibration() {
    calculator.vibration = !calculator.vibration;
}

function toggleScientificFunctions() {
    document.querySelector('.scientific-functions').classList.toggle('hidden');
}

function toggleHistory() {
    document.querySelector('.calculator-history').classList.toggle('hidden');
}

function evaluateExpression() {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);
    
    if (firstOperand != null && operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        calculator.displayValue = calculator.rounding ? `${parseFloat(result.toFixed(7))}` : `${result}`;
        calculator.history.push(`${firstOperand} ${operator} ${inputValue} = ${result}`);
        calculator.firstOperand = result;
        calculator.operator = null;
        updateHistory();
    }
}

document.querySelector('.calculator-keys').addEventListener('click', event => {
    const { target } = event;

    if (!target.matches('button')) return;

    if (target.classList.contains('operator') || target.classList.contains('function')) {
        handleOperator(target.value);
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        return;
    }

    if (target.classList.contains('backspace')) {
        handleBackspace();
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

    if (target.classList.contains('toggle-rounding')) {
        toggleRounding();
        return;
    }

    if (target.classList.contains('toggle-vibration')) {
        toggleVibration();
        return;
    }

    if (target.classList.contains('toggle-scf')) {
        toggleScientificFunctions();
        return;
    }

    if (target.classList.contains('toggle-history')) {
        toggleHistory();
        return;
    }

    if (target.classList.contains('equals')) {
        evaluateExpression();
        return;
    }

    inputDigit(target.value);
});
