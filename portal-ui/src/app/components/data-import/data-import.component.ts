import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { DataImport } from '../DataImport/DataImport';
import { registry } from '../../services/di-registry';

const DataImportWithRegistry = withRegistry(registry)(DataImport);

@Component({
  selector: 'crg-data-import',
  template: '<div class="data-import" #react></div>',
  styleUrls: ['./data-import.component.scss']
})
export class DataImportComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngOnInit() {
    if (!this.ref) {
      throw new Error('Ошибка: не найден root для react компонента');
    }

    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root?.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(DataImportWithRegistry);

    this.root?.render(reactElement);
  }
}
