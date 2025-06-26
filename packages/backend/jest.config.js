/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__test__/**/*.ts',
    '**/?(*.)+(spec|test).ts',
  ],
};
