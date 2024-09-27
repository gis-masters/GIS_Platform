import { Block } from '../../Block';

class MapToolbarBlock extends Block {
  selectors = {
    container: '.MapToolbar',
    cancelSelection: '.MapToolbar .MapSelection-Cancel',
    selectMultiple: '.MapToolbar .MapSelection-Select',
    labelsToggler: '.MapToolbar .MapLabels .MapLabels-Toggler',
    labelsTurningPoints: '.MapToolbar .MapLabels .MapTurningPoints',
    labelsDistances: '.MapToolbar .MapLabels .MapDistances'
  };

  async isCancelSelectionBtnExist(): Promise<boolean> {
    const $cancelSelectionBtn = await this.$('cancelSelection');

    return await $cancelSelectionBtn.isExisting();
  }

  async clickCancelSelectionBtn(): Promise<void> {
    const $cancelSelectionBtn = await this.$('cancelSelection');
    await $cancelSelectionBtn.waitForClickable();
    await $cancelSelectionBtn.click();
  }

  async clickSelectMultipleBtn(): Promise<void> {
    const $selectMultipleBtn = await this.$('selectMultiple');
    await $selectMultipleBtn.waitForClickable();
    await $selectMultipleBtn.click();
  }

  async clickTogglerBtn(): Promise<void> {
    await this.waitForVisible();
    const $togglerBtn = await this.$('labelsToggler');
    await $togglerBtn.waitForClickable();
    await $togglerBtn.click();
  }

  async clickTurningPointsBtn(): Promise<void> {
    const $turningPointsBtn = await this.$('labelsTurningPoints');
    await $turningPointsBtn.waitForClickable();
    await $turningPointsBtn.click();
  }

  async clickDistancesBtn(): Promise<void> {
    const $turningPointsBtn = await this.$('labelsDistances');
    await $turningPointsBtn.waitForClickable();
    await $turningPointsBtn.click();
  }
}

export const mapToolbarBlock = new MapToolbarBlock();
