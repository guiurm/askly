import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

export default [
    {
        input: "src/index.ts",
        output: {
            dir: "dist/mjs",
            format: "esm",
            entryFileNames: "index.mjs",
        },
        plugins: [typescript({ declaration: false, tsconfig: "./tsconfig.json" })],
    },
    {
        input: "dist/mjs/index.mjs",
        output: {
            dir: "dist/cjs",
            format: "cjs",
            entryFileNames: "index.cjs",
        },
        plugins: [typescript({ declaration: false, tsconfig: "./tsconfig.cjs.json" })],
    },
    {
        input: "./src/index.ts",
        output: [{ file: "dist/types/index.d.ts", format: "es" }],
        plugins: [dts()],
    },
];
