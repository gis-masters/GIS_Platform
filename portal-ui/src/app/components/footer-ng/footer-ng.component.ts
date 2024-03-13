import { Component, OnInit, OnDestroy, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/di-registry';
import { Footer } from '../Footer/Footer';

const FooterWithRegistry = withRegistry(registry)(Footer);

@Component({
  selector: 'crg-footer-ng',
  template: '<div class="footer-ng" #react></div>'
})
export class FooterNgComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('react', { read: ElementRef, static: true })
  ref?: ElementRef<HTMLDivElement>;
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
    const reactElement = createElement(FooterWithRegistry);

    this.root?.render(reactElement);
  }
}
