import {Component, Input} from '@angular/core';
import {ImportTaskFull} from '../../services/geoserver/import/import.service';

@Component({
  selector: 'crg-data-import-tasks-list',
  templateUrl: './data-import-tasks-list.component.html',
  styleUrls: ['./data-import-tasks-list.component.scss']
})
export class DataImportTasksListComponent {

  @Input() tasks: ImportTaskFull[];

  private statusesList: {[key: string]: string} = {
    PENDING: 'PENDING',
    READY: 'Готово',
    RUNNING: 'RUNNING',
    NO_CRS: 'Не определена проекция',
    NO_BOUNDS: 'NO_BOUNDS',
    NO_FORMAT: 'NO_FORMAT',
    BAD_FORMAT: 'BAD_FORMAT',
    ERROR: 'ERROR',
    CANCELED: 'CANCELED',
    COMPLETE: 'Завершен'
  };

  private errorCodes = [
    'PENDING',
    'NO_CRS',
    'NO_BOUNDS',
    'NO_FORMAT',
    'BAD_FORMAT',
    'ERROR',
    'CANCELED'
  ];

  constructor() { }

  isError (task: ImportTaskFull): boolean {
    return this.errorCodes.includes(task.state);
  }

  getDescription(task: ImportTaskFull): string {
    const { state } = task;
    if (Object.keys(this.statusesList).includes(state)) {
      return this.statusesList[state];
    } else {
      return 'Неопределенный статус';
    }
  }

}
