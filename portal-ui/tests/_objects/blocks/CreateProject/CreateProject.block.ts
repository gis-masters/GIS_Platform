import { Block } from '../../Block';

class CreateProjectBlock extends Block {
  selectors = {
    root: '.CreateProject',
    rootOfCreateProject: '.CreateProject_mode_project',
    rootOfCreateProjectFolder: '.CreateProject_mode_folder',
    dialog: '.CreateProject-Dialog'
  };

  async clickCreateProject() {
    const $root = await this.findBySelector('rootOfCreateProject');
    await $root.waitForDisplayed();
    await $root.click();
  }

  async clickCreateProjectFolder() {
    const $root = await this.findBySelector('rootOfCreateProjectFolder');
    await $root.waitForDisplayed();
    await $root.click();
  }

  async waitForCreateProjectVisible() {
    const $button = await this.findBySelector('rootOfCreateProject');
    await $button.waitForDisplayed();
  }

  async waitForCreateProjectFolderVisible() {
    const $button = await this.findBySelector('rootOfCreateProjectFolder');
    await $button.waitForDisplayed();
  }
}

export const createProjectBlock = new CreateProjectBlock();
