import { Block } from '../../Block';
import { xTableBlock } from '../XTable/XTable.block';

class SelectSuitableVectorLayerDialog extends Block {
  selectors = {
    container: '.SelectSuitableVectorLayerDialog',
    copyBtn: '.SelectSuitableVectorLayerDialog .MuiButton-outlinedPrimary',
    loading: '.SelectSuitableVectorLayerDialog .Loading',
    projectRow: '.SelectSuitableVectorLayerDialog .MuiTable-root .MuiTableRow-root'
  };

  async clickSubmitButton(): Promise<void> {
    const $copyBtn = await this.$('copyBtn');
    await $copyBtn.waitForClickable();
    await $copyBtn.click();
  }

  async waitForLoadingToHide(): Promise<void> {
    await this.waitForVisible();

    const $loading = await this.$('loading');

    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }

    await $loading.waitForDisplayed({ reverse: true });
  }

  async selectLayer(layer: string): Promise<void> {
    await this.waitForVisible();
    await xTableBlock.waitForLoading();

    const $userRow = await this.findLayerRow(layer);

    if (!$userRow) {
      throw new Error(`Не найден проект "${layer}"`);
    }

    const $layerSelect = await $userRow.$('.MuiTableCell-root:first-child input');
    await $layerSelect.click();
  }

  async findLayerRow(layer: string): Promise<WebdriverIO.Element | undefined> {
    await this.waitForLoadingToHide();

    const $$layerRows = await this.$$('projectRow');

    for (const $layerRow of $$layerRows) {
      const $layerRowName = await $layerRow.$('.MuiTableCell-root:nth-child(2)');
      const layerRowName = await $layerRowName.getText();

      if (layerRowName === layer) {
        return $layerRow;
      }
    }
  }
}

export const selectSuitableVectorLayerDialog = new SelectSuitableVectorLayerDialog();
