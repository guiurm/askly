import { clearLastLine, createCustomInterface } from '../utils/readlineUtils';

export type TQuestionConfig = {
    message: string;
    defaultValue?: string;
    minLength?: number;
    maxLength?: number;
    validate?: (input: string) => boolean;
    regexp?: { expression: RegExp; message: string };
};

export const askPassword = ({ message, defaultValue, maxLength, minLength, regexp, validate }: TQuestionConfig) => {
    let data = '';
    let first = true;

    const showMessage = () => {
        if (first) first = false;
        else clearLastLine();

        process.stdout.write(
            message +
                data
                    .split('')
                    .map(() => '*')
                    .join('')
        );
    };

    const validateInput = (input: string): { isValid: boolean; message?: string } => {
        if (validate && !validate(input)) return { isValid: false, message: 'Validator rejeted the answer' };
        if (maxLength && input.length > maxLength)
            return { isValid: false, message: `Answer too long, it needs to be at most ${maxLength}` };
        if (minLength && input.length < minLength)
            return { isValid: false, message: `Answer too short, it needs to be at least ${minLength}` };
        if (regexp && !regexp.expression.test(input)) return { isValid: false, message: regexp.message };
        return { isValid: true };
    };

    return new Promise<string>((resolve, reject) => {
        try {
            showMessage();
            const { close } = createCustomInterface((key: any) => {
                if (key.name === 'return') {
                    close();

                    const { isValid, message } = validateInput(data);
                    if (!isValid) {
                        reject(new Error(message));
                        return;
                    }
                    resolve(data === '' ? (defaultValue ?? '') : data);
                } else if (key.name === 'backspace') {
                    data = data.slice(0, -1);
                    showMessage();
                } else {
                    data += key.sequence;
                    showMessage();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};
