import { askPassword, question, select } from "../src";
import { confirm } from "../src/inputs/confirm";

const run = async () => {
    const conf = await confirm("Confirm");
    console.log(conf);

    const password = await askPassword({ message: "First password: " });
    console.log(password);

    const password2 = await askPassword({ message: "Second password: " });
    console.log(password2);

    const answer = await question({ message: "Question" });
    console.log(answer);

    const sel = await select({
        message: "Select",
        choices: [
            {
                name: "First",
                value: "first",
                description: "First description",
            },
            {
                name: "Second",
                value: "second",
                description: "Second description",
            },
        ],
    });
    console.log(sel);
};
run();
