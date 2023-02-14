import { binding, then } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class Attributes extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Attributes');
  }

  get $attributeTableHead(): Promise<WebdriverIO.Element> {
    return $('.Attributes-Table .XTable-Head');
  }

  get $$attributeTableCols(): Promise<WebdriverIO.Element[]> {
    return $$('.Attributes-Table .XTable-Head .XTable-CellContent');
  }

  @then(/^в атрибутивной таблице отображается только колонка "(.*)"$/)
  async checkTableColTitle(title: string): Promise<void> {
    const $attributeTableHead = await this.$attributeTableHead;
    await $attributeTableHead.waitForDisplayed({ timeout: 13_000 });

    const values = await this.getHeadCellsValues();

    expect(values).toEqual(['', 'ID', title]);
  }

  async getHeadCellsValues(): Promise<string[]> {
    const $$cellContents = await this.$$attributeTableCols;

    const contents: string[] = [];
    for (const $cell of $$cellContents) {
      contents.push(await $cell.$('.XTable-HeadCellTitle').getText());
    }

    return contents;
  }
}

export const attributes = new Attributes();
