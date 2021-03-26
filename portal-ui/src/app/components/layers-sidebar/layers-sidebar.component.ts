import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { LayersSidebar } from '../LayersSidebar/LayersSidebar';

@Component({
  selector: 'crg-layers-sidebar',
  template: '<div class="layers-sidebar" #react></div>',
  styleUrls: ['./layers-sidebar.component.scss']
})
export class LayersSidebarComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(LayersSidebar, {});

    render(reactElement, this.ref.nativeElement);
  }
}
