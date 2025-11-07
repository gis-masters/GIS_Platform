import { Block } from '../../Block';
import { xTableBlock } from '../XTable/XTable.block';

class SelectSuitableLayerDialogBlock extends Block {
  selectors = {
    root: '.SelectSuitableLayerDialog',
    openSelectLayerDialogBtn: '.SelectSuitableLayerDialog-LayerSelect',
    saveBtn: '.SelectSuitableLayerDialog .MuiButton-outlinedPrimary',
    loading: '.SelectSuitableLayerDialog .Loading',
    projectRow: '.SelectSuitableLayerDialog .MuiTable-root .MuiTableRow-root'
  };

  async clickOpenSelectLayerDialogBtn(): Promise<void> {
    const $root = await this.findBySelector('openSelectLayerDialogBtn');
    await $root.waitForClickable();
    await $root.click();
  }

  async selectLayer(layer: string): Promise<void> {
    await this.waitForVisible();
    await xTableBlock.waitForLoading();
    const $userRow = await this.findLayerRow(layer);

    if (!$userRow) {
      throw new Error(`Не найден проект "${layer}"`);
    }

    const $layerSelect = await $userRow.$('.MuiTableCell-root:first-child input').getElement();

    await $layerSelect.click();
  }

  async findLayerRow(layer: string): Promise<WebdriverIO.Element | undefined> {
    const $$layerRows = await this.findAllBySelector('projectRow');

    for (const $layerRow of $$layerRows) {
      const $layerRowName = await $layerRow.$('.MuiTableCell-root:nth-child(2)').getElement();
      const layerRowName = await $layerRowName.getText();

      if (layerRowName === layer) {
        return $layerRow;
      }
    }
  }

  async clickSubmitButton(): Promise<void> {
    const $saveBtn = await this.findBySelector('saveBtn');
    await $saveBtn.waitForClickable();
    await $saveBtn.click();

    await this.waitForHidden();
  }
}

export const selectSuitableLayerDialogBlock = new SelectSuitableLayerDialogBlock();
