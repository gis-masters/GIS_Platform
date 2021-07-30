const Block = require('../Block');

module.exports = class Toast extends Block {
  _elements = {
    container: '.Toast',
    moar: '.Toast-Moar',
    close: '.Toast-Close',
    details: '.Toast-Details',
    fileName: '.Toast-Source',
    fileNums: '.Toast-FileNums'
  };

  async clickMoar() {
    const { moar } = this._elements;
    const $moar = await this.browser.$(moar);

    return await $moar.click();
  }

  async clickClose() {
    const { close } = this._elements;
    const $close = await this.browser.$(close);

    return await $close.click();
  }

  produceError() {
    return this.browser.execute(() => {
      setTimeout(() => {
        window.notExistFunction();
      }, 1000);
    });
  }

  async mockErrorFile() {
    await this.browser.execute(({ fileName, fileNums }) => {
      document.querySelector(fileName).innerText = '/fakeFileName.js';
      document.querySelector(fileNums).innerText = '13:13';
    }, this._elements);
  }

  async waitForVisible() {
    const { container } = this._elements;
    const $container = await this.browser.$(container);

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется уведомление' });
    await this.browser.pause(1000); // animation
  }

  async waitForHidden() {
    const { container } = this._elements;
    const $container = await this.browser.$(container);

    await $container.waitForDisplayed({ timeout: 2000, reverse: true, timeoutMsg: 'Не скрывается уведомление' });
    await this.browser.pause(1000); // animation
  }

  async waitForDetails() {
    const { details } = this._elements;
    const $details = await this.browser.$(details);

    await $details.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляются детали' });
  }

  async waitForDetailsHidden() {
    const { details } = this._elements;
    const $details = await this.browser.$(details);

    await $details.waitForDisplayed({ reverse: true, timeoutMsg: 'Не скрываются детали' });
  }

  assertSelfie() {
    const { container } = this._elements;

    return this.browser.assertView('plain', container);
  }
};
