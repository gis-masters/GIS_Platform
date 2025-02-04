import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { FeaturesListSidebar } from '../FeaturesListSidebar/FeaturesListSidebar';

const FeaturesListSidebarWithRegistry = withRegistry(registry)(FeaturesListSidebar);

@Component({
  selector: 'crg-features-list-sidebar',
  template: '<div class="features-list-sidebar" #react></div>',
  styleUrls: ['./features-list-sidebar.component.scss']
})
export class FeaturesListSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() features?: WfsFeature[];
  @Input() layerTitle?: string;
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
    const reactElement = createElement(FeaturesListSidebarWithRegistry);

    this.root?.render(reactElement);
  }
}
