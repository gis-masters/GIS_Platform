import { Block } from '../../Block';

class BreadcrumbsBlock extends Block {
  selectors = {
    root: '.Breadcrumbs',
    items: '.Breadcrumbs-Item'
  };

  async getItemsText(): Promise<string[]> {
    const $$items = await this.findAllBySelector('items');
    const res: string[] = [];
    for (const $item of $$items) {
      res.push(await $item.getText());
    }

    return res;
  }
}

export const breadcrumbsBlock = new BreadcrumbsBlock();
