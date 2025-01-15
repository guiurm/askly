declare const confirm: (message: string) => Promise<unknown>;

type TQuestionConfig = {
    message: string;
    defaultValue?: string;
    minLength?: number;
    maxLength?: number;
    validate?: (input: string) => boolean;
    regexp?: {
        expression: RegExp;
        message: string;
    };
};
declare const askPassword: ({ message, defaultValue, maxLength, minLength, regexp, validate }: TQuestionConfig) => Promise<string>;

type TQuestionCOnfig = {
    message: string;
    default?: string;
    minLength?: number;
    maxLength?: number;
    validate?: (input: string) => boolean;
    regexp?: {
        expression: RegExp;
        message: string;
    };
};
declare function question({ message, ...config }: TQuestionCOnfig): Promise<string>;

type Choice = {
    name: string;
    value: string;
    description: string;
};
declare function select<Choices extends ReadonlyArray<Choice>>({ message, choices }: {
    message: string;
    choices: Choices;
}): Promise<Choices[number]>;

export { type TQuestionConfig, askPassword, confirm, question, select };
