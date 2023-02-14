import { binding, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';
import { editFeature } from '../EditFeature/EditFeature.block';

@binding()
class EditFeatureGeometryAsTextDialog extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.EditFeatureGeometry-AsTextDialog');
  }

  get $editFeatureGeometryAsTextDialogTextarea(): Promise<WebdriverIO.Element> {
    return $('.EditFeatureGeometry-AsTextDialog .MuiInputBase-inputMultiline:first-child');
  }

  get $editFeatureGeometryAsTextDialogSaveBtn(): Promise<WebdriverIO.Element> {
    return $('.EditFeatureGeometry-AsTextDialog .MuiButton-outlinedPrimary');
  }

  @when(/^в правом сайдбаре на карте заполняю координаты объекта$/)
  async setObjectCoordinates(): Promise<void> {
    const $editFeatureGeometryAsText = await editFeature.$editFeatureGeometryAsTextBtn;
    await $editFeatureGeometryAsText.waitForDisplayed();
    await $editFeatureGeometryAsText.click();

    const $editFeatureGeometryAsTextDialogTextarea = await this.$editFeatureGeometryAsTextDialogTextarea;
    await $editFeatureGeometryAsTextDialogTextarea.waitForDisplayed();
    await $editFeatureGeometryAsTextDialogTextarea.setValue('1 1');

    const $editFeatureGeometryAsTextDialogSaveBtn = await this.$editFeatureGeometryAsTextDialogSaveBtn;
    await $editFeatureGeometryAsTextDialogSaveBtn.click();
  }
}

export const editFeatureGeometryAsTextDialog = new EditFeatureGeometryAsTextDialog();
