import { Block } from '../../../Block';

class CreateDatasetFormBlock extends Block {
  selectors = {
    container: '.CreateDataset-Form',
    title: '.CreateDataset-Form input[name="title"]',
    submit: '.CreateDataset-Form .MuiButton-outlinedPrimary'
  };

  async setTitleValue(title: string): Promise<void> {
    const $title = await this.findBySelector('title');
    await $title.setValue(title);
  }

  async submit(): Promise<void> {
    const $submit = await this.findBySelector('submit');
    await $submit.click();
    await $submit.waitForExist({ reverse: true });
  }
}

export const createDatasetFormBlock = new CreateDatasetFormBlock();
