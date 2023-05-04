import { Block } from '../../Block';

class RestorePasswordBlock extends Block {
  selectors = {
    container: '.RestorePassword',
    email: '.RestorePassword input',
    restorePasswordBtn: '.RestorePassword button[type="submit"]'
  };

  async fillEmail(email: string) {
    const $email = await this.$('email');
    await $email.setValue(email);
  }

  async submit() {
    const $restorePasswordBtn = await this.$('restorePasswordBtn');
    await $restorePasswordBtn.waitForClickable();
    await $restorePasswordBtn.click();
  }
}

export const restorePasswordBlock = new RestorePasswordBlock();
