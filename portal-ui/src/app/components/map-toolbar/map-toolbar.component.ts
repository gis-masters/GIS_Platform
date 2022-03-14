import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { MapToolbar } from '../MapToolbar/MapToolbar';

@Component({
  selector: 'crg-map-toolbar',
  template: '<div class="map-toolbar" #react></div>',
  styleUrls: ['./map-toolbar.component.scss']
})
export class MapToolbarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() hidden: boolean;
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
    const reactElement = createElement(withRegistry(registry)(MapToolbar));

    render(reactElement, this.ref.nativeElement);
  }
}
