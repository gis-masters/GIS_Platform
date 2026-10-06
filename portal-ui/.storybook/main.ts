import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-webpack5';
import * as sass from 'sass';
import type { Configuration, RuleSetRule } from 'webpack';

import { isArray } from '../src/app/services/util/typeGuards/isArray';

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src');

const mjsRule: RuleSetRule = {
  test: /\.mjs$/,
  include: /node_modules/,
  type: 'javascript/auto'
};

const scssRule: RuleSetRule = {
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'sass-loader',
      options: {
        sassOptions: {
          includePaths: [srcDir]
        },
        implementation: sass
      }
    }
  ]
};

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-webpack5-compiler-babel', '@storybook/addon-links'],

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },

  typescript: {
    reactDocgen: false
  },

  staticDirs: [{ from: '../src/assets', to: '/assets' }],

  webpackFinal(webpackConfig: Configuration): Configuration {
    webpackConfig.module ??= {};
    webpackConfig.module.rules ??= [];
    webpackConfig.module.rules.push(mjsRule, scssRule);

    webpackConfig.resolve ??= {};

    const alias = webpackConfig.resolve.alias;
    webpackConfig.resolve.alias = {
      ...(alias && !isArray(alias) ? alias : {}),
      '../../services/data/files/files.client': path.resolve(
        srcDir,
        'app/components/Carousel/__mocks__/files.client.ts'
      )
    };

    return webpackConfig;
  }
};

export default config;
