import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { route } from '../../stores/Route.store';
import { registry } from '../../services/di-registry';
import { VectorTableRegistry } from '../VectorTable/VectorTableRegistry';

const VectorTableRegistryWithRegistry = withRegistry(registry)(VectorTableRegistry);

@Component({
  selector: 'crg-vector-table-registry',
  template: '<div class="vector-table-registry" #react></div>',
  styleUrls: ['./vector-table-registry.component.scss']
})
export class VectorTableRegistryComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;
  private root: Root;

  ngOnInit() {
    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root.unmount();
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
