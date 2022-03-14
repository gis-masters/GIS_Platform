import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { WfsFeature } from '../../services/geoserver/wfs.models';
import { registry } from '../../services/registry';
import { CopyUrlButton } from '../CopyUrlButton/CopyUrlButton';

@Component({
  selector: 'crg-copy-url-button',
  template: '<div class="copy-url-button" #react></div>',
  styleUrls: ['./copy-url-button.component.scss']
})
export class CopyUrlButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() feature: [WfsFeature];
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
    const reactElement = createElement(withRegistry(registry)(CopyUrlButton), { feature: this.feature });

    render(reactElement, this.ref.nativeElement);
  }
}
