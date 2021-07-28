import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { DataImport } from '../DataImport/DataImport';

@Component({
  selector: 'crg-data-import',
  template: '<div class="data-import" #react></div>',
  styleUrls: ['./data-import.component.scss']
})
export class DataImportComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

  ngOnInit() {
    this.renderReactElement();
  }

  ngOnDestroy() {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(DataImport);

    render(reactElement, this.ref.nativeElement);
  }
}
