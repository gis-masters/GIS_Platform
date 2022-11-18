export interface BlockModel {
  $container: Promise<WebdriverIO.Element>;
}

export abstract class Block {
  async waitForVisible(): Promise<true | void> {
    const $container = await (this as unknown as BlockModel).$container;

    return $container.waitForDisplayed({ timeout: 5000 });
  }

  async waitForHidden(): Promise<void> {
    const $container = await (this as unknown as BlockModel).$container;

    await $container.waitForDisplayed({
      reverse: true,
      timeout: 5000
    });
  }
}
