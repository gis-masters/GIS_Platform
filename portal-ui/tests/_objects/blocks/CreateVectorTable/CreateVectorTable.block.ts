import { Block } from '../../Block';
import { createVectorTableDialogBlock } from '../CreateVectorTableDialog/CreateVectorTableDialog.block';
import { ExplorerBlock } from '../Explorer/Explorer.block';
import { schemasSelectDialogBlock } from '../SchemasSelectDialog/SchemasSelectDialog.block';

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
    await schemasSelectDialogBlock.waitForSelectSchemaTableDisplay();
    await schemasSelectDialogBlock.clickSelectSchemaFirstOption();
    await schemasSelectDialogBlock.clickSelectSchemaConfirm();
    await schemasSelectDialogBlock.waitForSelectSchemaDisappear();
    await createVectorTableDialogBlock.clickSaveFormDialog();
  }
}

export const createVectorTableBlock = new CreateVectorTableBlock();
