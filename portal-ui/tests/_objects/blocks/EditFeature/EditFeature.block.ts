import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';
import { isEqual } from 'lodash';

import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';
import { hasClass } from '../../utils/hasClass';
import { CopyFeaturesButtonBlock } from '../CopyFeaturesButton/CopyFeaturesButton.block';
import { konfirmierenBlock } from '../Konfirmieren/Konfirmieren.block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class EditFeatureBlock extends Block {
  selectors = {
    container: '.EditFeature',
    editFeatureBack: '.EditFeature-Back',
    editFeatureSaveBtn: '.EditFeature-Save',
    editFeatureForm: '.EditFeature',
    editFeatureLabel: '.EditFeatureForm-Label',
    editFeatureField: '.EditFeatureForm-Row',
    editFeatureLoading: '.EditFeature .loading',
    navigationTextBox: '.EditFeature .EditFeatureNavigation-TextBox',
    navigationPrevFeatureBtn: '.EditFeature .EditFeatureNavigation-Prev .MuiButtonBase-root',
    navigationNextFeatureBtn: '.EditFeature .EditFeatureNavigation-Next .MuiButtonBase-root',
    lookupStatus: '.EditFeature .Lookup-Status',
    zoom: '.ZoomToFeature',
    loader: 'EditFeature .MuiLinearProgress-root'
  };

  copyFeaturesButton = new CopyFeaturesButtonBlock(this.selectors.container);

  async waitForLoading(): Promise<void> {
    const $editFeatureLoader = await this.findBySelector('editFeatureLoading');
    await $editFeatureLoader.waitForExist({ reverse: true });
  }

  async zoomToFeature(): Promise<void> {
    const $zoomToFeature = await this.findBySelector('zoom');
    await $zoomToFeature.waitForClickable();
    await $zoomToFeature.click();
  }

  async clickPrevButton(): Promise<void> {
    const $prevFeatureBtn = await this.findBySelector('navigationPrevFeatureBtn');
    await $prevFeatureBtn.click();
    await this.waitForLoading();
  }

  async clickNextButton(): Promise<void> {
    const $nextFeatureBtn = await this.findBySelector('navigationNextFeatureBtn');
    await $nextFeatureBtn.click();
    await this.waitForLoading();
  }

  async clickSaveButton(): Promise<void> {
    const $saveNewObjectBtn = await this.findBySelector('editFeatureSaveBtn');
    await $saveNewObjectBtn.click();
    await this.waitForLoading();
  }

  async focusSaveButton(): Promise<void> {
    const $saveNewObjectBtn = await this.findBySelector('editFeatureSaveBtn');
    await $saveNewObjectBtn.moveTo();
  }

  async closeConfirmDialog(): Promise<void> {
    await konfirmierenBlock.closeDialog();
    await this.waitForLoading();
  }

  async goBack(): Promise<void> {
    const $editFeatureBack = await this.findBySelector('editFeatureBack');
    await $editFeatureBack.waitForClickable();
    await $editFeatureBack.click();
  }

  async checkObjectAttributeFields(titles: string[]): Promise<void> {
    await this.waitForLoading();
    await this.waitForEditFeatureForm();

    await browser.waitUntil(
      async () => {
        return isEqual(await this.getFormFieldsLabels(), titles);
      },
      {
        timeout: 1000
      }
    );
  }

  async getFormFieldsLabels(): Promise<string[]> {
    const $$fieldLabels = await this.findAllBySelector('editFeatureLabel');

    const contents: string[] = [];
    for (const $label of $$fieldLabels) {
      contents.push(await $label.$('span').getText());
    }

    return contents;
  }

  async isReadonlyMode(): Promise<boolean> {
    const $container = await editFeatureBlock.findBySelector('container');

    return hasClass($container, 'EditFeature_readonly');
  }

  async openGeometryTab(): Promise<void> {
    const $container = await editFeatureBlock.findBySelector('container');

    const $geometryTab = await $container.$('.MuiButtonBase-root[role="Геометрия"]').getElement();
    await $geometryTab.waitForClickable();
    await $geometryTab.click();
    await sleep(500); // Анимация перелистывания ангуларовского таба
  }

  async getGeometryInViewMode(): Promise<string> {
    const $container = await editFeatureBlock.findBySelector('container');

    return $container.$('.EditFeatureGeometry-View').getText();
  }

  async waitForEditFeatureForm(): Promise<void> {
    const $editFeatureForm = await this.findBySelector('editFeatureForm');
    await $editFeatureForm.waitForDisplayed();
    const $someField = await this.findBySelector('editFeatureField');
    await $someField.waitForDisplayed({ timeoutMsg: 'Не отобразилось ни одно поле в форме' });
  }

  async changeEditFormFieldValue(title: string, value: string): Promise<void> {
    const $formField = await this.getFeatureEditField(title);

    const inputBlock = new MuiInputBlock(await $formField.$('.Form-Control').getElement());
    await inputBlock.waitForVisible();
    await inputBlock.clearValue();
    await inputBlock.setValue(value);
  }

  async getFeatureEditField(fieldName: string): Promise<WebdriverIO.Element> {
    await this.waitForEditFeatureForm();
    const $$fields = await this.findAllBySelector('editFeatureField');

    for (const $field of $$fields) {
      const name = await $field.$('.EditFeatureForm-Label').getText();

      if (name === fieldName) {
        return $field;
      }
    }

    throw new Error(`Не найден элемент ${fieldName}`);
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

  async waitForLoaderEnd(): Promise<void> {
    const loader = await this.findBySelector('loader');
    try {
      await loader.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }
    await loader.waitForExist({ reverse: true });
  }

  async checkFormControlFieldValue(title: string, value: string): Promise<boolean> {
    const $formField = await this.getFeatureEditField(title);

    const inputBlock = new MuiInputBlock(await $formField.$('.Form-Control').getElement());
    const inputValue = await inputBlock.getValue();

    return inputValue === value;
  }

  async getFormViewFieldValue(title: string): Promise<string> {
    const $formField = await this.getFeatureEditField(title);

    const inputBlock = await $formField.$('.Form-ViewValue').getElement();

    return await inputBlock.getText();
  }

  async getNavigationValue(): Promise<string> {
    const inputBlock = await this.findBySelector('navigationTextBox');

    return await inputBlock.getText();
  }
}

export const editFeatureBlock = new EditFeatureBlock();
