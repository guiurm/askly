import { createInterface, emitKeypressEvents, cursorTo, clearScreenDown } from 'readline';
import { createInterface as createInterface$1 } from 'node:readline/promises';
import * as readline from 'node:readline';

const createCustomInterface = (fn) => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    emitKeypressEvents(process.stdin, rl);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
    const handler = (_, key) => {
        //throw new Error("Not implemented");
        fn(key);
    };
    process.stdin.on('keypress', handler);
    const close = () => {
        rl.close();
        process.stdin.off('keypress', handler);
    };
    return { rl, close };
};
const clearLastLine = () => {
    cursorTo(process.stdout, 0);
    clearScreenDown(process.stdout);
};

// import chalk from 'chalk';
const confirm = (message) => {
    let accept = false;
    let first = true;
    const showMessage = () => {
        if (first)
            first = false;
        else
            clearLastLine();
        process.stdout.write(
        // `${message}: ` + (accept ? `${chalk.blueBright('> yes')} /   no ` : `  yes / ${chalk.blueBright('> no')}`)
        `${message}: ` + (accept ? `> yes /   no ` : `  yes / > no`));
    };
    return new Promise((resolve, reject) => {
        showMessage();
        try {
            const { close } = createCustomInterface(async (key) => {
                if (key.name === 'return') {
                    close();
                    resolve(accept);
                }
                else if (key.name === 'left' || key.name === 'right') {
                    accept = !accept;
                    showMessage();
                }
                else
                    showMessage();
            });
        }
        catch (error) {
            reject(error);
        }
    });
};

const askPassword = ({ message, defaultValue, maxLength, minLength, regexp, validate }) => {
    let data = '';
    let first = true;
    const showMessage = () => {
        if (first)
            first = false;
        else
            clearLastLine();
        process.stdout.write(message +
            data
                .split('')
                .map(() => '*')
                .join(''));
    };
    const validateInput = (input) => {
        if (validate && !validate(input))
            return { isValid: false, message: 'Validator rejeted the answer' };
        if (maxLength && input.length > maxLength)
            return { isValid: false, message: `Answer too long, it needs to be at most ${maxLength}` };
        if (minLength && input.length < minLength)
            return { isValid: false, message: `Answer too short, it needs to be at least ${minLength}` };
        if (regexp && !regexp.expression.test(input))
            return { isValid: false, message: regexp.message };
        return { isValid: true };
    };
    return new Promise((resolve, reject) => {
        try {
            showMessage();
            const { close } = createCustomInterface((key) => {
                if (key.name === 'return') {
                    close();
                    const { isValid, message } = validateInput(data);
                    if (!isValid) {
                        reject(new Error(message));
                        return;
                    }
                    resolve(data === '' ? (defaultValue ?? '') : data);
                }
                else if (key.name === 'backspace') {
                    data = data.slice(0, -1);
                    showMessage();
                }
                else {
                    data += key.sequence;
                    showMessage();
                }
            });
        }
        catch (error) {
            reject(error);
        }
    });
};

async function question({ message, ...config }) {
    const readlineInterface = createInterface$1({
        input: process.stdin,
        output: process.stdout
    });
    const answer = await readlineInterface.question(`${message} `);
    readlineInterface.close();
    if (config.maxLength && answer.length > config.maxLength) {
        throw new Error(`Answer too long, it needs to be at most ${config.maxLength}`);
    }
    if (config.minLength && answer.length < config.minLength) {
        throw new Error(`Answer too short, it needs to be at least ${config.minLength}`);
    }
    if (config.validate && !config.validate(answer)) {
        throw new Error('Validator rejeted the answer');
    }
    if (config.regexp && !config.regexp.expression.test(answer)) {
        throw new Error(config.regexp.message);
    }
    return answer;
}

async function select({ message, choices }) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let first = true;
    // Make the stdin emit keypress events, otherwise it won't emit them
    readline.emitKeypressEvents(process.stdin, rl);
    // `process.stdin.isTTY` is true if the stdin is a terminal
    if (process.stdin.isTTY) {
        // set the terminal in raw mode, so that we can capture the input for all keys
        process.stdin.setRawMode(true);
    }
    let selectedChoiceIndex = 0;
    const displayChoices = () => {
        if (!first) {
            readline.moveCursor(process.stdout, 0, -1 * choices.length - 1); // Mueve el cursor a la última línea
            readline.clearLine(process.stdout, 0); // Borra la línea
        }
        else {
            first = false;
        }
        console.log(message);
        choices.forEach((choice, index) => {
            if (index === selectedChoiceIndex) {
                // console.log(chalk.blueBright(`> ${choice.name}`));
                console.log(`> ${choice.name}`);
            }
            else {
                console.log(`  ${choice.name}`);
            }
        });
    };
    // Initial display
    displayChoices();
    return new Promise((resolve, reject) => {
        try {
            const keypressHandler = (_, key) => {
                if (key.name === 'up') {
                    selectedChoiceIndex = selectedChoiceIndex === 0 ? choices.length - 1 : selectedChoiceIndex - 1;
                    displayChoices();
                }
                else if (key.name === 'down') {
                    selectedChoiceIndex = selectedChoiceIndex === choices.length - 1 ? 0 : selectedChoiceIndex + 1;
                    displayChoices();
                }
                else if (key.name === 'return') {
                    resolve(choices[selectedChoiceIndex]);
                    process.stdin.off('keypress', keypressHandler);
                    if (process.stdin.isTTY) {
                        process.stdin.setRawMode(false);
                    }
                    rl.close();
                }
            };
            process.stdin.on('keypress', keypressHandler);
        }
        catch (error) {
            reject(error);
        }
    });
}

export { askPassword, confirm, question, select };
