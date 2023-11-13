import { Block } from '../../Block';
import { createVectorTableDialogBlock } from '../CreateVectorTableDialog/CreateVectorTableDialog.block';
import { ExplorerBlock } from '../Explorer/Explorer.block';
import { selectSchemaControlDialogBlock } from '../SelectSchemaControlDialog/SelectSchemaControlDialog.block';

class CreateVectorTableBlock extends Block {
  selectors = {
    container: '.CreateVectorTable'
  };

  // мануальное создание векторной таблицы
  async createTable(tableName: string): Promise<void> {
    const explorerBlock = new ExplorerBlock();
    await explorerBlock.clickCreateLayerBtn();
    await createVectorTableDialogBlock.waitForFormDialogDisplayed();
    await createVectorTableDialogBlock.setStringFieldValue('Наименование*', tableName);
    await createVectorTableDialogBlock.setChoiceFieldValue(
      'Координатная система*',
      'Pulkovo 1942 / Gauss-Kruger zone 6'
    );
    await createVectorTableDialogBlock.waitForFormDialogClickable();
    await createVectorTableDialogBlock.openSchemaSelection();
    await selectSchemaControlDialogBlock.waitForSelectSchemaTableDisplay();
    await selectSchemaControlDialogBlock.clickSelectSchemaFirstOption();
    await selectSchemaControlDialogBlock.clickSelectSchemaConfirm();
    await selectSchemaControlDialogBlock.waitForSelectSchemaDisappear();
    await createVectorTableDialogBlock.clickSaveFormDialog();
  }
}

export const createVectorTableBlock = new CreateVectorTableBlock();
