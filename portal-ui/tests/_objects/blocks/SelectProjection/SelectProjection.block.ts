import { Block } from '../../Block';
import { chooseXTableBlock } from '../ChooseXTable/ChooseXTable.block';
import { chooseXTableDialogBlock } from '../ChooseXTableDialog/ChooseXTableDialog.block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';

export class SelectProjectionBlock extends Block {
  selectors = {
    root: '.SelectProjection',
    select: '.SelectProjection-Select'
  };

  async select(code: string): Promise<void> {
    const $select = await this.findBySelector('select');
    await $select.waitForDisplayed();
    const muiSelect = new MuiSelectBlock(null, $select);

    try {
      // сначала пробуем выбрать проекцию из выпадающего списка
      await muiSelect.selectOptionByTitle(code, true);
    } catch {
      // если не получилось, то открываем диалог выбора
      await muiSelect.close();
      await muiSelect.selectOptionByTitle('Выбрать другую');
      await chooseXTableBlock.waitForVisible();
      await browser.pause(400); // анимация появления диалога и отрисовка содержимого таблицы
      const xTable = await chooseXTableBlock.getXTable();
      const [, srid] = code.split(':');
      await xTable.filterIdColumn('Код SRID', srid);
      await chooseXTableBlock.selectOne('Код SRID', srid);
      await chooseXTableDialogBlock.clickSubmitButton();
      await chooseXTableDialogBlock.waitForHidden();
    }
  }
}
