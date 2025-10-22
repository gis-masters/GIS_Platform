import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';
import { isEqual } from 'lodash';

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
    editFeatureGeometryAddGeometryBtn: '.EditFeatureContainer .EditFeatureGeometry-AddGeometry',
    editFeatureGeometryCopyCoordsBtn: '.EditFeatureContainer .EditFeatureGeometry-CopyCoords',
    editFeatureGeometryDeletePolygonBtn: '.EditFeatureContainer .EditFeatureGeometry-DelButton',
    editFeatureGeometryDeleteGroupBtn: '.EditFeatureContainer .EditFeatureGeometry-DelButton',
    editFeatureGeometryDeleteCoordBtn: '.EditFeatureContainer .EditFeatureGeometry-CoordDel',
    editFeatureGeometryDraw: '.EditFeatureContainer .EditFeatureGeometry-Draw',
    editFeatureGeometryAsTextBtn: '.EditFeatureContainer .EditFeatureGeometry-AsText',
    navigationTextBox: '.EditFeatureContainer .EditFeatureNavigation-TextBox',
    navigationPrevFeatureBtn: '.EditFeatureContainer .EditFeatureNavigation-Prev .MuiButtonBase-root',
    navigationNextFeatureBtn: '.EditFeatureContainer .EditFeatureNavigation-Next .MuiButtonBase-root',
    lookupStatus: '.EditFeatureContainer .Lookup-Status',
    zoom: '.ZoomToFeature',
    loader: 'EditFeatureContainer .MuiLinearProgress-root'
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

  async clickGeometryAsTextButton(): Promise<void> {
    const $editFeatureGeometryAsText = await editFeatureBlock.findBySelector('editFeatureGeometryAsTextBtn');

    await $editFeatureGeometryAsText.waitForDisplayed();
    await $editFeatureGeometryAsText.click();
    await sleep(400); // анимация открытия диалога
  }

  async clickAddGeometryButton(): Promise<void> {
    const $editFeatureGeometryAddGeometryBtn = await editFeatureBlock.findBySelector(
      'editFeatureGeometryAddGeometryBtn'
    );

    await $editFeatureGeometryAddGeometryBtn.waitForDisplayed();
    await $editFeatureGeometryAddGeometryBtn.click();
  }

  async hoverCopyCoordsButton(): Promise<void> {
    const $editFeatureGeometryCopyCoordsBtn = await editFeatureBlock.findBySelector('editFeatureGeometryCopyCoordsBtn');

    await $editFeatureGeometryCopyCoordsBtn.waitForDisplayed();
    await $editFeatureGeometryCopyCoordsBtn.moveTo();
  }

  async clickDeletePolygonButton(): Promise<void> {
    const $editFeatureGeometryDeletePolygonBtn = await editFeatureBlock.findBySelector(
      'editFeatureGeometryDeletePolygonBtn'
    );

    await $editFeatureGeometryDeletePolygonBtn.waitForDisplayed();
    await $editFeatureGeometryDeletePolygonBtn.click();
  }

  async clickDeleteGroupButton(): Promise<void> {
    const $editFeatureGeometryDeleteGroupBtn = await editFeatureBlock.findBySelector(
      'editFeatureGeometryDeleteGroupBtn'
    );

    await $editFeatureGeometryDeleteGroupBtn.waitForDisplayed();
    await $editFeatureGeometryDeleteGroupBtn.click();
  }

  async clickDeleteCoordButton(): Promise<void> {
    const $editFeatureGeometryDeleteCoordBtn = await editFeatureBlock.findBySelector(
      'editFeatureGeometryDeleteCoordBtn'
    );

    await $editFeatureGeometryDeleteCoordBtn.waitForDisplayed();
    await $editFeatureGeometryDeleteCoordBtn.click();
  }

  async clickEditOnMap(): Promise<void> {
    const $editFeatureGeometryDraw = await editFeatureBlock.findBySelector('editFeatureGeometryDraw');

    await $editFeatureGeometryDraw.waitForDisplayed();
    await $editFeatureGeometryDraw.click();
  }

  async isReadonlyMode(): Promise<boolean> {
    const $container = await editFeatureBlock.findBySelector('container');

    return hasClass($container, 'EditFeatureContainer_readonly');
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

  async getGeometryInEditMode(): Promise<string[]> {
    const $showAsTextBtn = await editFeatureBlock.findBySelector('editFeatureGeometryAsTextBtn');
    await $showAsTextBtn.scrollIntoView();

    const $container = await editFeatureBlock.findBySelector('container');

    return await extractValues([...(await $container.$$('.EditFeatureGeometry-CoordInput input').getElements())]);
  }

  async waitForEditFeatureForm(): Promise<void> {
    const $editFeatureForm = await this.findBySelector('editFeatureForm');
    await $editFeatureForm.waitForDisplayed();
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
