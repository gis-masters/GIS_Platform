import { Block } from '../../classes/Block';

export class ReportTemplateActionsBlock extends Block {
  selectors = {
    root: '.ReportTemplateActions',
    deleteBtn: '.ReportTemplateActions-Delete',
    editBtn: '.ReportTemplateActions-Edit'
  };

  async clickDelete(): Promise<void> {
    const $btn = await this.findBySelector('deleteBtn');
    await $btn.waitForDisplayed();
    await $btn.click();
  }

  async isDeleteButtonDisplayed(): Promise<boolean> {
    const $btn = await this.findBySelector('deleteBtn');
    if (!(await $btn.isExisting())) {
      return false;
    }

    return await $btn.isDisplayed();
  }

  async isDeleteButtonDisabled(): Promise<boolean> {
    const $btn = await this.findBySelector('deleteBtn');
    await $btn.waitForDisplayed();

    return !(await $btn.isEnabled());
  }

  async clickEdit(): Promise<void> {
    const $btn = await this.findBySelector('editBtn');
    await $btn.waitForDisplayed();
    await $btn.click();
  }

  async isEditButtonDisplayed(): Promise<boolean> {
    const $btn = await this.findBySelector('editBtn');
    if (!(await $btn.isExisting())) {
      return false;
    }

    return await $btn.isDisplayed();
  }

  async isEditButtonDisabled(): Promise<boolean> {
    const $btn = await this.findBySelector('editBtn');
    await $btn.waitForDisplayed();

    return !(await $btn.isEnabled());
  }
}
