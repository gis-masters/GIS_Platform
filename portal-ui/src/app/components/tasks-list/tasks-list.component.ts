import {Component, Input} from '@angular/core';
import {ImportTaskFull} from '../../services/geoserver/import/import.service';

@Component({
  selector: 'crg-error-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent {

  @Input() tasks: ImportTaskFull[];

  private errorCodes: {[key: string]: string} = {
    NO_CRS: 'Не определена проекция.',
    NO_BOUNDS: 'NO_BOUNDS',
    NO_FORMAT: 'NO_FORMAT',
    BAD_FORMAT: 'BAD_FORMAT',
    ERROR: 'ERROR',
    CANCELED: 'CANCELED',
    COMPLETE: 'Ошибок не найдено'
  };

  constructor() { }

  getErrorDescription(state: string) {
    if (Object.keys(this.errorCodes).includes(state)) {
      return this.errorCodes[state];
    } else {
      return 'Неопределенная ошибка';
    }
  }

}
