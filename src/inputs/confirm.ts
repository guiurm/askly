// import chalk from 'chalk';
import { clearLastLine, createCustomInterface } from '../utils/readlineUtils';

export const confirm = (message: string) => {
    let accept = false;
    let first = true;

    const showMessage = () => {
        if (first) first = false;
        else clearLastLine();

        process.stdout.write(
            // `${message}: ` + (accept ? `${chalk.blueBright('> yes')} /   no ` : `  yes / ${chalk.blueBright('> no')}`)
            `${message}: ` + (accept ? `> yes /   no ` : `  yes / > no`)
        );
    };

    return new Promise((resolve, reject) => {
        showMessage();
        try {
            const { close } = createCustomInterface(async (key: any) => {
                if (key.name === 'return') {
                    close();
                    resolve(accept);
                } else if (key.name === 'left' || key.name === 'right') {
                    accept = !accept;
                    showMessage();
                } else showMessage();
            });
        } catch (error) {
            reject(error);
        }
    });
};
