import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class EditFeature extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.edit-feature');
  }

  get $editFeatureSidebarSaveNewObjectBtn(): Promise<WebdriverIO.Element> {
    return $('.edit-feature .save-feature-edit-btn');
  }

  get $editFeatureForm(): Promise<WebdriverIO.Element> {
    return $('.edit-feature .edit-feature__form');
  }

  get $$editFeatureFormTitles(): Promise<WebdriverIO.Element[]> {
    return $$('.edit-feature .edit-feature__form .edit-item-title');
  }

  get $editFeatureGeometryAsTextBtn(): Promise<WebdriverIO.Element> {
    return $('.edit-feature .EditFeatureGeometry-AsText');
  }

  @when(/^в правом сайдбаре на карте нажимаю `Сохранить`$/)
  async saveNewObject(): Promise<void> {
    const $saveNewObjectBtn = await this.$editFeatureSidebarSaveNewObjectBtn;
    await $saveNewObjectBtn.click();
  }

  @then(/^в правом сайдбаре на карте в списке атрибутов отображается только поле "(.*)"$/)
  async checkObjectAttributeFields(title: string): Promise<void> {
    const $editFeatureForm = await this.$editFeatureForm;
    await $editFeatureForm.waitForDisplayed({ timeout: 4000 });

    const values = await this.getFormFieldsTitles();
    expect(values).toEqual([title]);
  }

  async getFormFieldsTitles(): Promise<string[]> {
    const $$fieldTitles = await this.$$editFeatureFormTitles;

    const contents: string[] = [];
    for (const $title of $$fieldTitles) {
      contents.push(await $title.$('span').getText());
    }

    return contents;
  }
}

export const editFeature = new EditFeature();
