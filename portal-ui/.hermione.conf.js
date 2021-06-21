const config = {
  sets: {
    common: {
      files: 'hermione/tests/common'
    },
    conv: {
      files: ['hermione/tests/common', 'hermione/tests/conv']
    },
    simf: {
      files: ['hermione/tests/common', 'hermione/tests/simf']
    }
  },

  baseUrl: 'http://localhost:4200/',
  gridUrl: 'http://10.10.10.116:4444/wd/hub',
  compositeImage: true,

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--headless']
        }
      },
      windowSize: '1300x900'
    },
    ff: {
      desiredCapabilities: {
        browserName: 'firefox',
        chromeOptions: {
          args: ['-headless']
        }
      },
      windowSize: '1300x900'
    }
  },

  plugins: {
    'html-reporter/hermione': {
      enabled: true,
      path: 'my/hermione-reports',
      defaultView: 'all',
      baseHost: 'http://localhost:3000'
    }
  },

  prepareBrowser: function (browser) {
    browser.addCommand('crgWaitForHidden', require('./hermione/commands/crgWaitForHidden').bind({ browser }));
    browser.addCommand('crgWaitForVisible', require('./hermione/commands/crgWaitForVisible').bind(browser));
  },

  retry: 2,

  system: {
    parallelLimit: 1
  }
};

const myConf = require('./.hermione.my-conf.js');

module.exports = Object.assign(config, myConf);
