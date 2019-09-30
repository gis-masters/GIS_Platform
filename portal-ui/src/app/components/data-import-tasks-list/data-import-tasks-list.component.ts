import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { createElement } from 'react';
import { render } from 'react-dom';

import { DataImportTasksList } from './DataImportTasksList';

import { ImportTaskShort } from '../../services/geoserver/import/models';

@Component({
  selector: 'crg-data-import-tasks-list',
  template: '<div #react></div>',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './DataImportTasksList.scss'
  ]
})
export class DataImportTasksListComponent implements OnInit, OnChanges {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;
  @Input() tasks: ImportTaskShort[];
  @Input() importState: string;

  ngOnInit () {
    this.renderReactElement();
  }

  ngOnChanges () {
    this.renderReactElement();
  }

  private renderReactElement() {
    const props = {
      tasks: this.tasks,
      importState: this.importState
    };
    const reactElement = createElement(DataImportTasksList, props);

    render(reactElement, this.ref.nativeElement);
  }
}
