import { Block, BlockModel } from '../../Block';

class Breadcrumbs extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Breadcrumbs');
  }

  get $$items(): Promise<WebdriverIO.Element[]> {
    return $$('.Breadcrumbs-Item');
  }

  async getItemsText(): Promise<string[]> {
    const $$items = await this.$$items;
    const res: string[] = [];
    for (const $item of $$items) {
      res.push(await $item.getText());
    }

    return res;
  }
}

export const breadcrumbs = new Breadcrumbs();
