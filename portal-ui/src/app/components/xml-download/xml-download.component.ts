import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { CrgVectorLayer } from '../../services/crg/projects.models';
import { XmlDownload } from '../XmlDownload/XmlDownload';
import { registry } from '../../services/registry';

@Component({
  selector: 'crg-xml-download',
  template: '<div class="xml-download" #react></div>',
  styleUrls: ['./xml-download.component.scss']
})
export class XmlDownloadComponent implements OnInit, OnChanges, OnDestroy {
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
    if (organizationSettings.downloadXmlGeometryEnabled) {
      const reactElement = createElement(withRegistry(registry)(XmlDownload), {
        feature: this.feature,
        layer: this.layer
      });

      this.root?.render(reactElement);
    }
  }
}
