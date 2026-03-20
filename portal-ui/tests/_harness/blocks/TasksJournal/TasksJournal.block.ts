import { Block } from '../../classes/Block';
import { MuiMenuBlock } from '../MuiMenu/MuiMenu.block';

export class TasksJournalBlock extends Block {
  selectors = {
    root: '.TasksJournal',
    loading: '.TasksJournal .Loading',
    createTaskButton: '.TasksJournal-CreateButton',
    taskRow: '.TasksJournal .MuiTableBody-root .MuiTableRow-root'
  };

  async clickCreateTaskMenuBtn(): Promise<void> {
    await this.waitForVisible();

    const $createTaskMenuBtn = await this.findBySelector('createTaskButton');
    await $createTaskMenuBtn.waitForClickable();
    await $createTaskMenuBtn.click();
  }

  async selectItemInCreateTaskMenu(option: string): Promise<void> {
    const muiSelect = new MuiMenuBlock();
    await muiSelect.clickItemByTitle(option);
  }

  async getTaskRowValue(): Promise<string[]> {
    await this.waitForVisible();

    const $loading = await this.findBySelector('loading');

    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }
    await $loading.waitForExist({ reverse: true });

    const $taskRow = await this.findBySelector('taskRow');
    const $$taskCells = await $taskRow.$$('.MuiTableCell-root').getElements();
    const taskRowValue = [];

    for (const $taskCell of $$taskCells) {
      try {
        const $textOverflow = await $taskCell.$('.TextOverflow-Value').getElement();
        const taskCell = await $textOverflow.getText();
        taskRowValue.push(taskCell);
      } catch {
        const taskCell = await $taskCell.getText();
        taskRowValue.push(taskCell);
      }
    }

    return taskRowValue;
  }

  async getTaskStatus(id: string): Promise<string> {
    const $taskRow = await this.findTaskRow(id);

    const $taskStatus = await $taskRow.$('.MuiTableCell-root:nth-child(5)').getElement();

    return await $taskStatus.getText();
  }

  async selectTaskMenuAction(id: string, menuItemTitle: string): Promise<void> {
    const $taskRow = await this.findTaskRow(id);

    const $actions = await $taskRow.$('.TasksJournal-Actions').getElement();
    await $actions.click();

    const muiSelect = new MuiMenuBlock();
    await muiSelect.clickItemByTitle(menuItemTitle);
  }

  async findTaskRow(id: string): Promise<WebdriverIO.Element> {
    await this.waitForVisible();

    const $loading = await this.findBySelector('loading');

    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }

    await $loading.waitForExist({ reverse: true });

    const $$taskRow = await this.findAllBySelector('taskRow');

    for (const $taskRow of $$taskRow) {
      const $taskId = await $taskRow.$('.MuiTableCell-root:nth-child(2)').getElement();
      const currentId = await $taskId.getText();

      if (currentId === id) {
        return $taskRow;
      }
    }

    throw new Error(`Задача с id ${id} не найдена`);
  }
}

export const tasksJournalBlock = new TasksJournalBlock();
