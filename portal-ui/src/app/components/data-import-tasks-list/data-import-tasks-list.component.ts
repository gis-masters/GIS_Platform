import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

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
export class DataImportTasksListComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;
  @Input() tasks: ImportTaskShort[];
  @Input() importState: string;

  ngOnInit () {
    this.renderReactElement();
  }

  ngOnDestroy () {
    unmountComponentAtNode(this.ref.nativeElement);
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
