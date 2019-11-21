const Block = require('../Block');

module.exports = class Toast extends Block {
  _elements = {
    container: '.Toast',
    moar: '.Toast-Moar',
    details: '.Toast-Details',
    file: '.Toast-File'
  }

  clickMoar () {
    const { moar } = this._elements;

    return this.browser.click(moar);
  }

  produceError () {
    return this.browser.execute(() => {
      setTimeout(()=>{ window.nonexistentFunction(); }, 1000);
    });
  }

  async waitForVisible () {
    const { container } = this._elements;

    await this.browser.crgWaitForVisible(container, 2000, 'Не появляется уведомление');
    await this.browser.pause(1000); // animation
  }

  async waitForDetails () {
    const { details } = this._elements;

    await this.browser.crgWaitForVisible(details, 'Не появляются детали');
  }

  async waitForDetailsHidden () {
    const { details } = this._elements;

    await this.browser.crgWaitForHidden(details, 'Не скрываются детали');
  }

  assertSelfie () {
    const { container, file } = this._elements;

    return this.browser.assertView('plain', container, {ignoreElements: [file]});
  }
};
