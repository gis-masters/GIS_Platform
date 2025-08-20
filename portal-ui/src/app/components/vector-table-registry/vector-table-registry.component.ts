import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { route } from '../../stores/Route.store';
import { VectorTableRegistry } from '../VectorTableRegistry/VectorTableRegistry';

const VectorTableRegistryWithRegistry = withRegistry(registry)(VectorTableRegistry);

@Component({
  selector: 'crg-vector-table-registry',
  template: '<div class="vector-table-registry" #react></div>',
  styleUrls: ['./vector-table-registry.component.scss']
})
export class VectorTableRegistryComponent implements OnInit, OnChanges, OnDestroy {
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
    const vectorTable = route.params.vectorTable;
    const dataset = route.params.dataset;
    const reactElement = createElement(VectorTableRegistryWithRegistry, {
      vectorTableIdentifier: vectorTable,
      datasetIdentifier: dataset,
      id: 'vectorTableRegistryPage'
    });
    this.root?.render(reactElement);
  }
}
