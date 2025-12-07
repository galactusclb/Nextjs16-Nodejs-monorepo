module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    transform:  {
        "^.+\\.ts?$": "ts-jest",
    },
    testRegex: "((\\.|/)(test|spec))\\.ts?$",
    moduleFileExtensions: ["ts", "js", "json", "node"],

    //for mocking Prisma client
    // setupFilesAfterEnv: ['<rootDir>/singleton.ts'],
}