import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { OpenInAnotherProject } from '../OpenInAnotherProject/OpenInAnotherProject';

const OpenInAnotherProjectWithRegistry = withRegistry(registry)(OpenInAnotherProject);

@Component({
  selector: 'crg-open-in-another-project',
  template: '<div class="open-in-another-project" #react></div>',
  styleUrls: ['./open-in-another-project.component.scss']
})
export class OpenInAnotherProjectComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: [WfsFeature];
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
    const reactElement = createElement(OpenInAnotherProjectWithRegistry, { feature: this.features[0] });

    this.root?.render(reactElement);
  }
}
