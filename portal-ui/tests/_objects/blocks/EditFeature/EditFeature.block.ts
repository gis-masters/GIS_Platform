import { Block } from '../../Block';
import { hasClass } from '../../utils/hasClass';

class EditFeatureBlock extends Block {
  selectors = {
    container: '.edit-feature',
    editFeatureSidebarSaveNewObjectBtn: '.edit-feature .save-feature-edit-btn',
    editFeatureForm: '.edit-feature .edit-feature__form',
    editFeatureFormTitles: '.edit-feature .edit-feature__form .edit-item-title',
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

    const values = await this.getFormFieldsTitles();
    expect(values).toEqual([title]);
  }

  async getFormFieldsTitles(): Promise<string[]> {
    const $$fieldTitles = await this.$$('editFeatureFormTitles');

    const contents: string[] = [];
    for (const $title of $$fieldTitles) {
      contents.push(await $title.$('span').getText());
    }

    return contents;
  }

  async clickGeometryAsTextButton() {
    const $editFeatureGeometryAsText = await editFeatureBlock.$('editFeatureGeometryAsTextBtn');
    await $editFeatureGeometryAsText.waitForDisplayed();
    await $editFeatureGeometryAsText.click();
  }

  async isReadonlyMode(): Promise<boolean> {
    const $container = await editFeatureBlock.$('container');

    return hasClass($container, 'edit-feature_readonly');
  }
}

export const editFeatureBlock = new EditFeatureBlock();
