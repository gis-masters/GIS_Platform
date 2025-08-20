module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },

  staticDirs: [{ from: '../src/assets', to: '/assets' }],

  webpackFinal: async (config, { configType }) => {
    /* @graphql-tools uses mjs modules, but storybook's webpack config doesn't
     * support them. This adds support. Once this is supported out of the box,
     * this can be removed. Relevant issues:
     *  https://github.com/ardatan/graphql-tools/issues/3325
     *  https://github.com/storybookjs/storybook/issues/6003 */
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });

    config.resolve.alias['../../services/data/files/files.client'] = require.resolve(
      '../src/app/components/Carousel/__mocks__/files.client.ts'
    );

    return config;
  },

  docs: {
    autodocs: false
  }
};
