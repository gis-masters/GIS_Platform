import { Block } from '../../classes/Block';

class RestorePasswordBlock extends Block {
  selectors = {
    root: '.RestorePassword',
    email: '.RestorePassword input',
    restorePasswordBtn: '.RestorePassword button[type="submit"]'
  };

  async fillEmail(email: string) {
    const $email = await this.findBySelector('email');
    await $email.setValue(email);
  }

  async submit() {
    const $restorePasswordBtn = await this.findBySelector('restorePasswordBtn');
    await $restorePasswordBtn.waitForClickable();
    await $restorePasswordBtn.click();
  }
}

export const restorePasswordBlock = new RestorePasswordBlock();
