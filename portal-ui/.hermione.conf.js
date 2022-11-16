const config = {
  sets: {
    ui: { files: ['hermione/tests/ui'] },
    e2e: { files: ['hermione/tests/e2e'] },
    stage58: { files: ['hermione/tests/deployment/common', 'hermione/tests/deployment/stage58'] },
    stage98: { files: ['hermione/tests/deployment/common', 'hermione/tests/deployment/stage98'] },
    stage172: { files: ['hermione/tests/deployment/common', 'hermione/tests/deployment/stage172'] }
  },

  baseUrl: 'http://localhost:4200/',
  gridUrl: 'http://10.10.10.116:4444/wd/hub',
  compositeImage: true,

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless']
        }
      },
      windowSize: '1300x900'
    }
    // ff: {
    //   desiredCapabilities: {
    //     browserName: 'firefox',
    //     'moz:firefoxOptions': {
    //       args: ['-headless']
    //     }
    //   },
    //   windowSize: '1300x900'
    // }
  },

  plugins: {
    'html-reporter/hermione': {
      enabled: true,
      path: 'my/hermione-reports',
      defaultView: 'all',
      baseHost: 'http://localhost:3000'
    }
  },

  // prepareBrowser: function (browser) {
  //   browser.addCommand('testMeta', require('./hermione/objects/commands/testMeta').bind({ browser }));
  //   browser.addCommand('crgWaitForVisible', require('./hermione/commands/crgWaitForVisible').bind(browser));
  // },

  retry: 2,

  system: {
    parallelLimit: 1,
    fileExtensions: ['.ts', '.js']
  },
  sessionQuitTimeout: 60000,
  takeScreenshotOnFailsTimeout: 60000,
  httpTimeout: 60000,
  pageLoadTimeout: 60000
};

const myConf = require('./.hermione.my-conf.js');

module.exports = Object.assign(config, myConf);
