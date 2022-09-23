import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { WfsFeature } from '../../services/geoserver/wfs.models';
import { registry } from '../../services/di-registry';
import { CopyUrlButton } from '../CopyUrlButton/CopyUrlButton';

const CopyUrlButtonWithRegistry = withRegistry(registry)(CopyUrlButton);

@Component({
  selector: 'crg-copy-url-button',
  template: '<div class="copy-url-button" #react></div>',
  styleUrls: ['./copy-url-button.component.scss']
})
export class CopyUrlButtonComponent implements OnInit, OnDestroy, OnChanges {
  @Input() feature: [WfsFeature];
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
    const reactElement = createElement(CopyUrlButtonWithRegistry, { feature: this.feature });

    this.root?.render(reactElement);
  }
}
