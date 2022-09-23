import { Component, OnInit, OnDestroy, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/di-registry';
import { Footer } from '../Footer/Footer';

const FooterWithRegistry = withRegistry(registry)(Footer);

@Component({
  selector: 'crg-footer',
  template: '<div class="footer" #react></div>'
})
export class FooterComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(FooterWithRegistry);

    this.root?.render(reactElement);
  }
}
