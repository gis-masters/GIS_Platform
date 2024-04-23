import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { Attributes } from '../Attributes/Attributes';

const AttributesWithRegistry = withRegistry(registry)(Attributes);

@Component({
  selector: 'crg-attributes-ng',
  template: '<div class="attributes-ng" #react></div>',
  styleUrls: ['./attributes-ng.component.scss']
})
export class AttributesNgComponent implements OnInit, OnDestroy {
  @Input() class?: string;
  @ViewChild('react', { read: ElementRef, static: true })
  ref?: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(AttributesWithRegistry, {
      className: this.class
    });

    this.root?.render(reactElement);
  }

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
}
