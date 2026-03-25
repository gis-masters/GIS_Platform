import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../classes/Block';
import { hasClass } from '../../commands/hasClass';
import { answerModalTypeConfirmBlock } from '../AnswerModal/_type/AnswerModal_type_confirm.block';
import { CopyFeaturesButtonBlock } from '../CopyFeaturesButton/CopyFeaturesButton.block';

class EditFeatureBlock extends Block {
  selectors = {
    root: '.EditFeature',
    back: '.EditFeature-Back',
    saveBtn: '.EditFeature-Save',
    lookupStatus: '.EditFeature .Lookup-Status',
    loader: '.EditFeature .MuiLinearProgress-root'
  };

  copyFeaturesButton = new CopyFeaturesButtonBlock(this.selectors.root);

  async clickSaveButton(): Promise<void> {
    const $saveNewObjectBtn = await this.findBySelector('saveBtn');
    await $saveNewObjectBtn.click();
    await this.waitForLoading();
  }

  async focusSaveButton(): Promise<void> {
    const $saveNewObjectBtn = await this.findBySelector('saveBtn');
    await $saveNewObjectBtn.moveTo();
  }

  async closeConfirmDialog(): Promise<void> {
    await answerModalTypeConfirmBlock.confirm();
    await this.waitForLoading();
  }

  async goBack(): Promise<void> {
    const $editFeatureBack = await this.findBySelector('back');
    await $editFeatureBack.waitForClickable();
    await $editFeatureBack.click();
  }

  async isReadonlyMode(): Promise<boolean> {
    const $root = await editFeatureBlock.findBySelector('root');

    return hasClass($root, 'EditFeature_readonly');
  }

  async openGeometryTab(): Promise<void> {
    const $root = await editFeatureBlock.findBySelector('root');

    const $geometryTab = await $root.$('.MuiButtonBase-root[role="Геометрия"]').getElement();
    await $geometryTab.waitForClickable();
    await $geometryTab.click();
    await sleep(500); // Анимация перелистывания ангуларовского таба
  }

  async getGeometryInViewMode(): Promise<string> {
    const $root = await editFeatureBlock.findBySelector('root');

    return $root.$('.EditFeatureGeometry-View').getText();
  }

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $lookupStatus = await this.findBySelector('lookupStatus');

    try {
      await $lookupStatus.waitForDisplayed();
    } catch {
      // ignore
    }

    await super.assertSelfie(tag, {
      hideElements: [$lookupStatus, ...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }
}

export const editFeatureBlock = new EditFeatureBlock();
