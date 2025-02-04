import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { MapToolbar } from '../MapToolbar/MapToolbar';

const MapToolbarWithRegistry = withRegistry(registry)(MapToolbar);

@Component({
  selector: 'crg-map-toolbar',
  template: '<div class="map-toolbar" #react></div>',
  styleUrls: ['./map-toolbar.component.scss']
})
export class MapToolbarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() hidden?: boolean;
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
    const reactElement = createElement(MapToolbarWithRegistry);

    this.root?.render(reactElement);
  }
}
