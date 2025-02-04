import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        babelConfig: {
          presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript']
        }
      }
    ],
    '^.+\\.jsx?$': [
      'ts-jest',
      {
        useESM: true,
        babelConfig: {
          presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript']
        }
      }
    ]
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};

export default jestConfig;
