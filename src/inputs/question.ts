import { createInterface } from 'node:readline/promises';

type TQuestionCOnfig = {
    message: string;
    default?: string;
    minLength?: number;
    maxLength?: number;
    validate?: (input: string) => boolean;
    regexp?: { expression: RegExp; message: string };
};
export async function question({ message, ...config }: TQuestionCOnfig) {
    const readlineInterface = createInterface({
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
