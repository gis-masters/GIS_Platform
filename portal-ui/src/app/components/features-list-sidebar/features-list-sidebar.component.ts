import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { WfsFeature } from '../../services/geoserver/wfs-models';
import { FeaturesListSidebar } from '../FeaturesListSidebar/FeaturesListSidebar';

@Component({
  selector: 'crg-features-list-sidebar',
  template: '<div class="features-list-sidebar" #react></div>',
  styleUrls: ['./features-list-sidebar.component.scss']
})
export class FeaturesListSidebarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() features: WfsFeature[];
  @Input() layerTitle: string;
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

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
    const reactElement = createElement(FeaturesListSidebar);

    render(reactElement, this.ref.nativeElement);
  }
}
