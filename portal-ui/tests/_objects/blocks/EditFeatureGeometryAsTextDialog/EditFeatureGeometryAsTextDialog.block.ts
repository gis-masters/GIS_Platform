import { Block } from '../../Block';
import { editFeature } from '../EditFeature/EditFeature.block';

class EditFeatureGeometryAsTextDialog extends Block {
  selectors = {
    container: '.EditFeatureGeometry-AsTextDialog',
    editFeatureGeometryAsTextDialogTextarea:
      '.EditFeatureGeometry-AsTextDialog .MuiInputBase-inputMultiline:first-child',
    editFeatureGeometryAsTextDialogSaveBtn: '.EditFeatureGeometry-AsTextDialog .MuiButton-outlinedPrimary'
  };

  async setObjectDummyCoordinates(): Promise<void> {
    await editFeature.clickGeometryAsTextButton();

    const $editFeatureGeometryAsTextDialogTextarea = await this.$('editFeatureGeometryAsTextDialogTextarea');
    await $editFeatureGeometryAsTextDialogTextarea.waitForDisplayed();
    await $editFeatureGeometryAsTextDialogTextarea.setValue('1 1');

    const $editFeatureGeometryAsTextDialogSaveBtn = await this.$('editFeatureGeometryAsTextDialogSaveBtn');
    await $editFeatureGeometryAsTextDialogSaveBtn.click();
  }
}

export const editFeatureGeometryAsTextDialog = new EditFeatureGeometryAsTextDialog();
