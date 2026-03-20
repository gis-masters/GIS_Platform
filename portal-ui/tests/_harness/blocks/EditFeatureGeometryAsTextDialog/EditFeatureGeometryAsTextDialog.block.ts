import { Key } from 'webdriverio';

import { assertString } from '../../../../src/app/utils/assertString';
import { Block } from '../../classes/Block';

class EditFeatureGeometryAsTextDialogBlock extends Block {
  selectors = {
    root: '.EditFeatureGeometry-AsTextDialog',
    dialogTextarea: '.EditFeatureGeometry-AsTextDialog .MuiInputBase-inputMultiline:not([readonly])',
    saveBtn: '.EditFeatureGeometry-AsTextDialog .MuiButton-outlinedPrimary',
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

    const $editFeatureGeometryAsTextDialogSaveBtn = await this.findBySelector('saveBtn');
    await $editFeatureGeometryAsTextDialogSaveBtn.click();
  }

  async getObjectCoordinates(): Promise<string> {
    const $dialogTextarea = await this.findBySelector('dialogTextarea');
    await $dialogTextarea.waitForDisplayed();

    return assertString(await $dialogTextarea.getValue(), 'dialogTextarea.getValue');
  }
}

export const editFeatureGeometryAsTextDialogBlock = new EditFeatureGeometryAsTextDialogBlock();
