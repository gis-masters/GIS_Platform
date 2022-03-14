import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { DataImport } from '../DataImport/DataImport';
import { registry } from '../../services/registry';

@Component({
  selector: 'crg-data-import',
  template: '<div class="data-import" #react></div>',
  styleUrls: ['./data-import.component.scss']
})
export class DataImportComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

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
    const reactElement = createElement(withRegistry(registry)(DataImport));

    render(reactElement, this.ref.nativeElement);
  }
}
