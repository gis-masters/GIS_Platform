import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { createElement } from 'react';

import { XmlDownload } from '../XmlDownload/XmlDownload';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { CrgLayer } from '../../services/crg/projects.models';

@Component({
  selector: 'crg-xml-download',
  template: '<div class="xml-download" #react></div>',
  styleUrls: ['./xml-download.component.scss']
})
export class XmlDownloadComponent implements OnInit, OnChanges, OnDestroy {
  @Input() feature: WfsFeature;
  @Input() layer: CrgLayer;
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
    const reactElement = createElement(XmlDownload, { feature: this.feature, layer: this.layer });

    render(reactElement, this.ref.nativeElement);
  }
}
