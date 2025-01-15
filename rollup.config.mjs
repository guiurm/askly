import { dts } from "rollup-plugin-dts";

export default [
    {
        input: "build/mjs/index.js",
        output: {
            dir: "dist",
            format: "esm",
            entryFileNames: "index.mjs",
        },
        //plugins: [typescript({ declaration: false, tsconfig: "./tsconfig.json" })],
    },
    {
        input: "build/cjs/index.js",
        output: {
            dir: "dist",
            format: "cjs",
            entryFileNames: "index.cjs",
        },
        //plugins: [typescript({ declaration: false, tsconfig: "./tsconfig-cjs.json" })],
    },
    {
        input: "build/mjs/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "es" }],
        plugins: [dts()],
    },
];
