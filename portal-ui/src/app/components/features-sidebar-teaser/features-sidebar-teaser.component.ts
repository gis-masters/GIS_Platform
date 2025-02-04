import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { FeaturesSidebarTeaser } from '../FeaturesSidebarTeaser/FeaturesSidebarTeaser';

const FeaturesSidebarTeaserWithRegistry = withRegistry(registry)(FeaturesSidebarTeaser);

@Component({
  selector: 'crg-features-sidebar-teaser',
  styleUrls: ['./features-sidebar-teaser.component.scss'],
  template: '<div class="features-sidebar-teaser" #react></div>'
})
export class FeaturesSidebarTeaserComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(FeaturesSidebarTeaserWithRegistry);

    this.root?.render(reactElement);
  }
}
