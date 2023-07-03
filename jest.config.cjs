module.exports = {
  testMatch: ['**/__tests__/**.[tj]s?(x)'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // "transform": {
  //   "^.+\\.ts?$": "ts-jest"
  // },
  // "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$",
  // "moduleFileExtensions": [
  //   "ts",
  //   "js",
  //   "json",
  //   "node"
  // ],
  // "setupFiles": [
  //   "<rootDir>/test/setupTests.ts"
  // ]
};
