import { isEqual } from 'lodash';
import { WdioCheckElementMethodOptions } from 'wdio-image-comparison-service';

import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';
import { extractValues } from '../../commands/extractText';
import { hasClass } from '../../utils/hasClass';
import { CopyFeaturesButtonBlock } from '../CopyFeaturesButton/CopyFeaturesButton.block';
import { konfirmierenBlock } from '../Konfirmieren/Konfirmieren.block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class EditFeatureBlock extends Block {
  selectors = {
    container: '.EditFeatureContainer',
    editFeatureBack: '.EditFeatureContainer-Back',
    editFeatureSaveBtn: '.EditFeatureContainer .save-feature-edit-btn',
    editFeatureForm: '.EditFeatureContainer',
    editFeatureLabel: '.EditFeatureForm-Label',
    editFeatureField: '.EditFeatureForm-Row',
    editFeatureLoading: '.EditFeatureContainer .loading',
    editFeatureGeometryDraw: '.EditFeatureContainer .EditFeatureGeometryDraw',
    editFeatureGeometryAsTextBtn: '.EditFeatureContainer .EditFeatureGeometry-AsText',
    lookupStatus: '.EditFeatureContainer .Lookup-Status',
    zoom: '.ZoomToFeature',
    loader: 'EditFeatureContainer .MuiLinearProgress-root'
  };

  copyFeaturesButton = new CopyFeaturesButtonBlock(this.selectors.container);

  async waitForLoading(): Promise<void> {
    const $editFeatureLoader = await this.$('editFeatureLoading');
    await $editFeatureLoader.waitForDisplayed({ reverse: true });
  }

  async zoomToFeature(): Promise<void> {
    const $zoomToFeature = await this.$('zoom');
    await $zoomToFeature.waitForClickable();
    await $zoomToFeature.click();
  }

  async clickSaveButton(): Promise<void> {
    const $saveNewObjectBtn = await this.$('editFeatureSaveBtn');
    await $saveNewObjectBtn.click();
    await this.waitForLoading();
  }

  async focusSaveButton(): Promise<void> {
    const $saveNewObjectBtn = await this.$('editFeatureSaveBtn');
    await $saveNewObjectBtn.moveTo();
  }

  async closeConfirmDialog(): Promise<void> {
    await konfirmierenBlock.closeDialog();
    await this.waitForLoading();
  }

  async goBack(): Promise<void> {
    const $editFeatureBack = await this.$('editFeatureBack');
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
    const $$fieldLabels = await this.$$('editFeatureLabel');

    const contents: string[] = [];
    for (const $label of $$fieldLabels) {
      contents.push(await $label.$('span').getText());
    }

    return contents;
  }

  async clickGeometryAsTextButton(): Promise<void> {
    const $editFeatureGeometryAsText = await editFeatureBlock.$('editFeatureGeometryAsTextBtn');

    await $editFeatureGeometryAsText.waitForDisplayed();
    await $editFeatureGeometryAsText.click();
  }

  async clickEditOnMap(): Promise<void> {
    const $editFeatureGeometryDraw = await editFeatureBlock.$('editFeatureGeometryDraw');

    await $editFeatureGeometryDraw.waitForDisplayed();
    await $editFeatureGeometryDraw.click();
  }

  async isReadonlyMode(): Promise<boolean> {
    const $container = await editFeatureBlock.$('container');

    return hasClass($container, 'EditFeatureContainer_readonly');
  }

  async openGeometryTab(): Promise<void> {
    const $container = await editFeatureBlock.$('container');

    const $geometryTab = await $container.$('.MuiButtonBase-root[role="Геометрия"]');
    await $geometryTab.waitForClickable();
    await $geometryTab.click();
    await sleep(500); // Анимация перелистывания ангуларовского таба
  }

  async getGeometryInViewMode(): Promise<string> {
    const $container = await editFeatureBlock.$('container');

    return $container.$('.EditFeatureGeometry-View').getText();
  }

  async getGeometryInEditMode(): Promise<string[]> {
    const $showAsTextBtn = await editFeatureBlock.$('editFeatureGeometryAsTextBtn');
    await $showAsTextBtn.scrollIntoView();

    const $container = await editFeatureBlock.$('container');

    return await extractValues([...(await $container.$$('.EditFeatureGeometry-CoordInput input'))]);
  }

  async waitForEditFeatureForm(): Promise<void> {
    const $editFeatureForm = await this.$('editFeatureForm');
    await $editFeatureForm.waitForDisplayed({ timeout: 4000 });
  }

  async changeEditFormFieldValue(title: string, value: string): Promise<void> {
    const $formField = await this.getFeatureEditField(title);
    if (!$formField) {
      throw new Error(`Не найден элемент ${title}`);
    }

    const inputBlock = new MuiInputBlock(await $formField.$('.Form-Control'));
    await inputBlock.waitForVisible();
    await inputBlock.clearValue();
    await inputBlock.setValue(value);
  }

  async getFeatureEditField(fieldName: string): Promise<WebdriverIO.Element | undefined> {
    await this.waitForVisible();
    const $$fields = await this.$$('editFeatureField');

    for (const $field of $$fields) {
      const name = await $field.$('.EditFeatureForm-Label').getText();

      if (name === fieldName) {
        return $field;
      }
    }
  }

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $lookupStatus = await this.$('lookupStatus');

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
    const loader = await this.$('loader');
    try {
      await loader.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }
    await loader.waitForDisplayed({ reverse: true });
  }

  async checkFormFieldValue(title: string, value: string): Promise<boolean> {
    const $formField = await this.getFeatureEditField(title);
    if (!$formField) {
      throw new Error(`Не найден элемент ${title}`);
    }

    const inputBlock = new MuiInputBlock(await $formField.$('.Form-Control'));
    const inputValue = await inputBlock.getValue();

    return inputValue === value;
  }
}

export const editFeatureBlock = new EditFeatureBlock();
