import typescript from "@rollup/plugin-typescript";

export default [
    {
        input: "src/index.ts",
        output: {
            dir: "dist/",
            format: "esm",
            entryFileNames: "index.mjs",
        },
        plugins: [typescript({ tsconfig: "./tsconfig.mjs.json" })],
    },
    {
        input: "dist/index.mjs",
        output: {
            dir: "dist/",
            format: "cjs",
            entryFileNames: "index.cjs",
        },
        plugins: [typescript({ tsconfig: "./tsconfig.cjs.json" })],
    },
];
