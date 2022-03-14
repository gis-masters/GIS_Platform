import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { WfsFeature } from '../../services/geoserver/wfs.models';
import { registry } from '../../services/registry';
import { ZoomToFeature } from '../ZoomToFeature/ZoomToFeature';

@Component({
  selector: 'crg-zoom-to-feature',
  template: '<div class="zoom-to-feature" #react></div>',
  styleUrls: ['./zoom-to-feature.component.scss']
})
export class ZoomToFeatureComponent implements OnInit, OnDestroy, OnChanges {
  @Input() feature: WfsFeature;
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.renderReactElement();
  }

  ngOnDestroy() {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(withRegistry(registry)(ZoomToFeature), { feature: this.feature });

    render(reactElement, this.ref.nativeElement);
  }
}
