import { Key } from 'webdriverio';

import { Block } from '../../Block';

class EditFeatureGeometryAsTextDialogBlock extends Block {
  selectors = {
    container: '.EditFeatureGeometry-AsTextDialog',
    editFeatureGeometryAsTextDialogTextarea:
      '.EditFeatureGeometry-AsTextDialog .MuiInputBase-inputMultiline:first-child',
    editFeatureGeometryAsTextDialogSaveBtn: '.EditFeatureGeometry-AsTextDialog .MuiButton-outlinedPrimary',
    textarea: '.EditFeatureGeometry-Text textarea'
  };

  async setObjectDummyCoordinates(coords?: string[][]): Promise<void> {
    const $textarea = await this.$('textarea');
    await $textarea.waitForDisplayed();
    await $textarea.click();

    await $textarea.moveTo();
    await $textarea.click();

    await browser.keys([Key.Ctrl, 'a']);
    await browser.keys([Key.Backspace]);

    if (coords) {
      for (const coord of coords) {
        await $textarea.setValue(coord[0]);
        await $textarea.setValue(' ');
        await $textarea.setValue(coord[1]);
        await browser.keys([Key.Shift, Key.Enter]);
      }
    }

    const $editFeatureGeometryAsTextDialogSaveBtn = await this.$('editFeatureGeometryAsTextDialogSaveBtn');
    await $editFeatureGeometryAsTextDialogSaveBtn.click();
  }

  async getObjectCoordinates(): Promise<string> {
    const $editFeatureGeometryAsTextDialogTextarea = await this.$('editFeatureGeometryAsTextDialogTextarea');
    await $editFeatureGeometryAsTextDialogTextarea.waitForDisplayed();

    return await $editFeatureGeometryAsTextDialogTextarea.getText();
  }
}

export const editFeatureGeometryAsTextDialogBlock = new EditFeatureGeometryAsTextDialogBlock();
