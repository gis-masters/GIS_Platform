import { Block } from '../../Block';
import { chooseXTableBlock } from '../ChooseXTable/ChooseXTable.block';
import { chooseXTableDialogBlock } from '../ChooseXTableDialog/ChooseXTableDialog.block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';

export class SelectProjectionBlock extends Block {
  selectors = {
    container: '.SelectProjection',
    select: '.SelectProjection-Select'
  };

  async selectProjectionByCode(code: string): Promise<void> {
    const [, srid] = code.split(':');
    const $select = await this.$('select');
    const muiSelect = new MuiSelectBlock(null, $select);
    await muiSelect.selectOptionByTitle('Выбрать другую');
    await chooseXTableBlock.waitForVisible();
    const xTable = await chooseXTableBlock.getXTable();
    await xTable.filterStringColumn('Код SRID', srid);
    await chooseXTableBlock.selectOne('Код SRID', srid);
    await chooseXTableDialogBlock.clickSubmitButton();
    await chooseXTableDialogBlock.waitForHidden();
  }
}
