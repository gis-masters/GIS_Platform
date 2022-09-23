import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { FeatureExtract } from '../FeatureExtract/FeatureExtract';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { CrgVectorLayer } from '../../services/gis/projects.models';
import { registry } from '../../services/di-registry';

const FeatureExtractWithRegistry = withRegistry(registry)(FeatureExtract);

@Component({
  selector: 'crg-feature-extract',
  template: '<div class="feature-extract" #react></div>',
  styleUrls: ['./feature-extract.component.scss']
})
export class FeatureExtractComponent implements OnInit, OnDestroy, OnChanges {
  @Input() feature: WfsFeature;
  @Input() layer: CrgVectorLayer;
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
    const reactElement = createElement(FeatureExtractWithRegistry, {
      feature: this.feature,
      layer: this.layer
    });

    this.root?.render(reactElement);
  }
}
