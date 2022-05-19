import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { WfsFeature } from '../../services/geoserver/wfs.models';
import { registry } from '../../services/registry';
import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';

const ZoomToFeatureWithRegistry = withRegistry(registry)(ZoomToFeature);

@Component({
  selector: 'crg-zoom-to-feature',
  template: '<div class="zoom-to-feature" #react></div>',
  styleUrls: ['./zoom-to-feature.component.scss']
})
export class ZoomToFeatureComponent implements OnInit, OnDestroy, OnChanges {
  @Input() feature: WfsFeature;
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
    const reactElement = createElement(ZoomToFeatureWithRegistry, { feature: this.feature });

    this.root?.render(reactElement);
  }
}
