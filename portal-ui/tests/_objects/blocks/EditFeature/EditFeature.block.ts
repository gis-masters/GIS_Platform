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
    root: '.EditFeature',
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

  copyFeaturesButton = new CopyFeaturesButtonBlock(this.selectors.root);

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

  async waitForEditFeatureForm(): Promise<void> {
    const $editFeatureForm = await this.findBySelector('editFeatureForm');
    await $editFeatureForm.waitForDisplayed();
    const $someField = await this.findBySelector('editFeatureField');
    await $someField.waitForDisplayed({ timeoutMsg: 'Не отобразилось ни одно поле в форме' });
  }

  async changeEditFormFieldValue(title: string, value: string): Promise<void> {
    const inputBlock = await this.getMuiInputBlockElement(title);

    await inputBlock.waitForVisible();
    await inputBlock.clearValue();
    await inputBlock.setValue(value);
  }

  async addValueToEditFormFieldValue(value: string, title: string): Promise<void> {
    const inputBlock = await this.getMuiInputBlockElement(title);
    await inputBlock.waitForVisible();

    const $input = await inputBlock.findBySelector('input');
    await $input.click();

    await browser.keys(['Home']); // Home для перехода в начало строки
    await browser.pause(100); // пауза для гарантии

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
    const $control = await $formField.$('.Form-Control').getElement();

    // Проверяем, является ли поле Select (choice)
    const hasSelect = await $control
      .$('.MuiSelect-select')
      .isExisting()
      .catch(() => false);

    if (hasSelect) {
      // Для Select получаем текст из .MuiSelect-select
      const $selectInput = await $control.$('.MuiSelect-select').getElement();
      const selectValue = await $selectInput.getText();

      return selectValue.trim() === value;
    }

    // Для обычных input используем getValue()
    const inputBlock = new MuiInputBlock($control);
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

  async getMuiInputBlockElement(title: string): Promise<MuiInputBlock> {
    const $formField = await this.getFeatureEditField(title);

    return new MuiInputBlock(await $formField.$('.Form-Control').getElement());
  }
}

export const editFeatureBlock = new EditFeatureBlock();
