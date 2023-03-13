import { Block } from '../../Block';

class BreadcrumbsBlock extends Block {
  selectors = {
    container: '.Breadcrumbs',
    items: '.Breadcrumbs-Item'
  };

  async getItemsText(): Promise<string[]> {
    const $$items = await this.$$('items');
    const res: string[] = [];
    for (const $item of $$items) {
      res.push(await $item.getText());
    }

    return res;
  }
}

export const breadcrumbsBlock = new BreadcrumbsBlock();
