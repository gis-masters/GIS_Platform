import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { createElement } from 'react';

import { OpenInAnotherProject } from '../OpenInAnotherProject/OpenInAnotherProject';
import { WfsFeature } from '../../services/geoserver/wfs.models';

@Component({
  selector: 'crg-open-in-another-project',
  template: '<div class="open-in-another-project" #react></div>',
  styleUrls: ['./open-in-another-project.component.scss']
})
export class OpenInAnotherProjectComponent implements OnInit, OnChanges, OnDestroy {
  @Input() features: [WfsFeature];
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
    const reactElement = createElement(OpenInAnotherProject, { feature: this.features[0] });

    render(reactElement, this.ref.nativeElement);
  }
}
