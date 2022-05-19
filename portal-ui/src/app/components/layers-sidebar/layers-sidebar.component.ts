import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { LayersSidebar } from '../LayersSidebar/LayersSidebar';

const LayersSidebarWithRegistry = withRegistry(registry)(LayersSidebar);

@Component({
  selector: 'crg-layers-sidebar',
  template: '<div class="layers-sidebar" #react></div>',
  styleUrls: ['./layers-sidebar.component.scss']
})
export class LayersSidebarComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(LayersSidebarWithRegistry);

    this.root?.render(reactElement);
  }
}
