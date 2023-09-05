import { Block } from '../../Block';
import { hasClass } from '../../utils/hasClass';
import { FormBlock } from '../Form/Form.block';

class OrganizationSettingsBlock extends Block {
  selectors = {
    container: '.OrganizationSettings',
    save: '.OrganizationSettings .MuiButton-outlinedPrimary'
  };

  async disableOrgOption(option: string): Promise<void> {
    await this.waitForVisible();

    const formBlock = new FormBlock();
    const $field = await formBlock.getField(option);

    const $optionCheckbox = await $field.$('.MuiCheckbox-root');
    const isOptionChecked = await hasClass($optionCheckbox, 'Mui-checked');

    if (isOptionChecked) {
      await $optionCheckbox.click();
      const $save = await this.$('save');
      await $save.click();
    }
  }
}

export const organizationSettingsBlock = new OrganizationSettingsBlock();
