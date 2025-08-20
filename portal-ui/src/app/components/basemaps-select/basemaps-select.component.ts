import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { BasemapsSelect } from '../BasemapsSelect/BasemapsSelect';

const BasemapsSelectWithRegistry = withRegistry(registry)(BasemapsSelect);

@Component({
  selector: 'crg-basemaps-select',
  template: '<div class="basemaps-select" #react></div>',
  styleUrls: ['./basemaps-select.component.scss']
})
export class BasemapsSelectComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(BasemapsSelectWithRegistry);

    this.root?.render(reactElement);
  }
}
