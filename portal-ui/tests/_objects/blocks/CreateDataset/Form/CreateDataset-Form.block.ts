import { Block, BlockModel } from '../../../Block';

class CreateDatasetForm extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.CreateDataset-Form');
  }

  get $title(): Promise<WebdriverIO.Element> {
    return $('.CreateDataset-Form input[name="title"]');
  }

  get $submit(): Promise<WebdriverIO.Element> {
    return $('.CreateDataset-Form .MuiButton-outlinedPrimary');
  }

  async setTitleValue(title: string): Promise<void> {
    const $title = await this.$title;
    await $title.setValue(title);
  }

  async submit(): Promise<void> {
    const $submit = await this.$submit;
    await $submit.click();
    await $submit.waitForDisplayed({ reverse: true });
  }
}

export const createDatasetForm = new CreateDatasetForm();
