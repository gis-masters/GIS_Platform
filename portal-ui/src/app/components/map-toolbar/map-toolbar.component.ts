import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { MapToolbar } from '../MapToolbar/MapToolbar';

@Component({
  selector: 'crg-map-toolbar',
  template: '<div class="map-toolbar" #react></div>',
  styleUrls: ['./map-toolbar.component.scss']
})
export class MapToolbarComponent implements OnInit, OnDestroy, OnChanges {
  @Input() hidden: boolean;
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
    const reactElement = createElement(MapToolbar);

    render(reactElement, this.ref.nativeElement);
  }
}
