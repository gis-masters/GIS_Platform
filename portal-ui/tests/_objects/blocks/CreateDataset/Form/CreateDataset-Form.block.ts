import { Block } from '../../../Block';

class CreateDatasetFormBlock extends Block {
  selectors = {
    container: '.CreateDataset-Form',
    title: '.CreateDataset-Form input[name="title"]',
    submit: '.CreateDataset-Form .MuiButton-outlinedPrimary'
  };

  async setTitleValue(title: string): Promise<void> {
    const $title = await this.$('title');
    await $title.setValue(title);
  }

  async submit(): Promise<void> {
    const $submit = await this.$('submit');
    await $submit.click();
    await $submit.waitForDisplayed({ reverse: true });
  }
}

export const createDatasetFormBlock = new CreateDatasetFormBlock();
