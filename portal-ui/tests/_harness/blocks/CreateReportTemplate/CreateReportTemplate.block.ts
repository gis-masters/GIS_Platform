import { Block } from '../../classes/Block';

export class CreateReportTemplateBlock extends Block {
  selectors = {
    root: '.CreateReportTemplate'
  };

  async click(): Promise<void> {
    const $el = await this.findBySelector('root');
    await $el.waitForDisplayed();
    await $el.click();
  }
}
