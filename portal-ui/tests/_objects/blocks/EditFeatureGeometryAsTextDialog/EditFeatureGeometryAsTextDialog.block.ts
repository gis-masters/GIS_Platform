import { Key } from 'webdriverio';

import { Block } from '../../Block';

class EditFeatureGeometryAsTextDialogBlock extends Block {
  selectors = {
    container: '.EditFeatureGeometry-AsTextDialog',
    editFeatureGeometryAsTextDialogTextarea:
      '.EditFeatureGeometry-AsTextDialog .MuiInputBase-inputMultiline:not([readonly])',
    editFeatureGeometryAsTextDialogSaveBtn: '.EditFeatureGeometry-AsTextDialog .MuiButton-outlinedPrimary',
    textarea: '.EditFeatureGeometry-Text textarea'
  };

  async setObjectDummyCoordinates(coords?: string[][]): Promise<void> {
    const $textarea = await this.findBySelector('textarea');
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

    const $editFeatureGeometryAsTextDialogSaveBtn = await this.findBySelector('editFeatureGeometryAsTextDialogSaveBtn');
    await $editFeatureGeometryAsTextDialogSaveBtn.click();
  }

  async getObjectCoordinates(): Promise<string> {
    const $editFeatureGeometryAsTextDialogTextarea = await this.findBySelector(
      'editFeatureGeometryAsTextDialogTextarea'
    );
    await $editFeatureGeometryAsTextDialogTextarea.waitForDisplayed();

    return await $editFeatureGeometryAsTextDialogTextarea.getValue();
  }
}

export const editFeatureGeometryAsTextDialogBlock = new EditFeatureGeometryAsTextDialogBlock();
