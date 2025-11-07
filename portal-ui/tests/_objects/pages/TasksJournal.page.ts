import { Page } from '../Page';

export class TasksJournalPage extends Page {
  selectors = {
    root: '.TasksJournal'
  };
  title = 'Журнал задач';
  url = '/data-management/tasks-journal';
}
