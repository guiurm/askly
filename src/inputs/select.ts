import * as readline from 'node:readline';

import chalk from 'chalk';

type Choice = {
    name: string;
    value: string;
    description: string;
};

export async function select<Choices extends ReadonlyArray<Choice>>({
    message,
    choices
}: {
    message: string;
    choices: Choices;
}): Promise<Choices[number]> {
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
        } else {
            first = false;
        }

        console.log(message);
        choices.forEach((choice, index) => {
            if (index === selectedChoiceIndex) {
                console.log(chalk.blueBright(`> ${choice.name}`));
            } else {
                console.log(`  ${choice.name}`);
            }
        });
    };

    // Initial display
    displayChoices();

    return new Promise((resolve, reject) => {
        try {
            const keypressHandler = (_: string, key: readline.Key) => {
                if (key.name === 'up') {
                    selectedChoiceIndex = selectedChoiceIndex === 0 ? choices.length - 1 : selectedChoiceIndex - 1;
                    displayChoices();
                } else if (key.name === 'down') {
                    selectedChoiceIndex = selectedChoiceIndex === choices.length - 1 ? 0 : selectedChoiceIndex + 1;
                    displayChoices();
                } else if (key.name === 'return') {
                    resolve(choices[selectedChoiceIndex]);
                    process.stdin.off('keypress', keypressHandler);

                    if (process.stdin.isTTY) {
                        process.stdin.setRawMode(false);
                    }

                    rl.close();
                }
            };

            process.stdin.on('keypress', keypressHandler);
        } catch (error) {
            reject(error);
        }
    });
}
