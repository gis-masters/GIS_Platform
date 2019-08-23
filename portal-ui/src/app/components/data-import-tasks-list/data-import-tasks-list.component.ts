import {Component, Input} from '@angular/core';
import {ImportTaskFull} from '../../services/geoserver/import/import.service';

@Component({
  selector: 'crg-data-import-tasks-list',
  templateUrl: './data-import-tasks-list.component.html',
  styleUrls: ['./data-import-tasks-list.component.scss']
})
export class DataImportTasksListComponent {

  @Input() tasks: ImportTaskFull[];

  private errorCodes: {[key: string]: string} = {
    NO_CRS: 'Не определена проекция.',
    NO_BOUNDS: 'NO_BOUNDS',
    NO_FORMAT: 'NO_FORMAT',
    BAD_FORMAT: 'BAD_FORMAT',
    ERROR: 'ERROR',
    CANCELED: 'CANCELED',
    COMPLETE: 'Успешно'
  };

  constructor() { }

  getDescription(task: ImportTaskFull): string {
    const { state } = task;
    if (Object.keys(this.errorCodes).includes(state)) {
      return this.errorCodes[state];
    } else {
      return 'Неопределенная ошибка';
    }
  }

}
