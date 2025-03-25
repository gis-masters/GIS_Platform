import { Page } from '../Page';

export class TasksJournalPage extends Page {
  selectors = {
    container: '.TasksJournal'
  };
  title = 'Журнал задач';
  url = '/data-management/tasks-journal';
}
