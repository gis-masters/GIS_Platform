const Block = require('../Block');

module.exports = class ToastError extends Block {
  _elements = {
    container: '.ToastError',
    moar: '.ToastError-Moar',
    details: '.ToastError-Details',
    file: '.ToastError-File'
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

    await this.browser.crgWaitForVisible(container, 2000, 'Не появляется уведомление об ошибке');
    await this.browser.pause(1000); // animation
  }

  async waitForDetails () {
    const { details } = this._elements;

    await this.browser.crgWaitForVisible(details, 'Не появляются детали ошибки');
  }

  async waitForDetailsHidden () {
    const { details } = this._elements;

    await this.browser.crgWaitForHidden(details, 'Не скрываются детали ошибки');
  }

  assertSelfie () {
    const { container, file } = this._elements;

    return this.browser.assertView('plain', container, {ignoreElements: [file]});
  }
};
