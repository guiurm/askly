import { clearScreenDown, createInterface, cursorTo, emitKeypressEvents, Key } from 'readline';

export const createCustomInterface = (fn: (key: any) => void | Promise<void>) => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    emitKeypressEvents(process.stdin, rl);

    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    const handler = (_: string, key: Key) => {
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

export const clearLastLine = () => {
    cursorTo(process.stdout, 0);
    clearScreenDown(process.stdout);
};
