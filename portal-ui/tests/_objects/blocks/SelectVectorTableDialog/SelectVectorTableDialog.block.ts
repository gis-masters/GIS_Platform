import { binding, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class SelectVectorTableDialog extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.SelectVectorTable-Dialog');
  }

  get $datasourceDialogAddBtn(): Promise<WebdriverIO.Element> {
    return $('.SelectVectorTable-Dialog .MuiButton-outlinedPrimary');
  }

  @when(/^в диалоге выбора источника данных в проекте нажимаю `Выбрать`$/)
  async selectVectorTableBtn(): Promise<void> {
    const $datasourceDialogAddBtn = await this.$datasourceDialogAddBtn;
    await $datasourceDialogAddBtn.waitForDisplayed({ timeout: 3000 });

    await $datasourceDialogAddBtn.click();
  }
}

export const selectVectorTableDialog = new SelectVectorTableDialog();
