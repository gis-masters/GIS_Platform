import { Block } from '../../Block';
import { hasClass } from '../../utils/hasClass';
import { sleep } from '../../../../src/app/services/util/sleep';
import { extractValues } from '../../commands/extractText';

class EditFeatureBlock extends Block {
  selectors = {
    container: '.edit-feature',
    editFeatureSidebarSaveNewObjectBtn: '.edit-feature .save-feature-edit-btn',
    editFeatureForm: '.edit-feature__form',
    editFeatureLabel: '.edit-feature__label',
    editFeatureField: '.edit-feature__field',
    editFeatureLoading: '.edit-feature .loading',
    editFeatureGeometryAsTextBtn: '.edit-feature .EditFeatureGeometry-AsText'
  };

  async saveNewObject(): Promise<void> {
    const $saveNewObjectBtn = await this.$('editFeatureSidebarSaveNewObjectBtn');
    await $saveNewObjectBtn.click();
  }

  async checkObjectAttributeFields(title: string): Promise<void> {
    const $editFeatureLoader = await this.$('editFeatureLoading');
    await $editFeatureLoader.waitForDisplayed({ reverse: true });

    const $editFeatureForm = await this.$('editFeatureForm');
    await $editFeatureForm.waitForDisplayed({ timeout: 4000 });

    const values = await this.getFormFieldsLabels();
    expect(values).toEqual([title]);
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

  async isReadonlyMode(): Promise<boolean> {
    const $container = await editFeatureBlock.$('container');

    return hasClass($container, 'edit-feature_readonly');
  }

  async openGeometryTab(): Promise<void> {
    const $container = await editFeatureBlock.$('container');

    const $geometryTab = await $container.$('.mat-tab-label=Геометрия');
    await $geometryTab.waitForClickable();
    await $geometryTab.click();
    await sleep(500); // Анимация перелистывания ангуларовского таба
  }

  async getGeometryInViewMode(): Promise<string> {
    const $container = await editFeatureBlock.$('container');

    return $container.$('.EditFeatureGeometry-View').getText();
  }

  async getGeometryInEditMode(): Promise<string[]> {
    const $container = await editFeatureBlock.$('container');

    return await extractValues(await $container.$$('.EditFeatureGeometry-CoordInput input'));
  }
}

export const editFeatureBlock = new EditFeatureBlock();
