import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { DataManagement } from '../DataManagement/DataManagement';

const DataManagementWithRegistry = withRegistry(registry)(DataManagement);

@Component({
  selector: 'crg-data-management',
  template: '<div class="data-management" #react></div>',
  styleUrls: ['./data-management.component.scss']
})
export class DataManagementComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(DataManagementWithRegistry);

    this.root?.render(reactElement);
  }
}
