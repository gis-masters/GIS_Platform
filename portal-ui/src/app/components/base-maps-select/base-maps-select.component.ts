import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { createElement } from 'react';

import { BaseMapsSelect } from '../BaseMapsSelect/BaseMapsSelect';

@Component({
  selector: 'crg-base-maps-select',
  template: '<div class="base-maps-select" #react></div>',
  styleUrls: ['./base-maps-select.component.scss']
})
export class BaseMapsSelectComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(BaseMapsSelect);

    render(reactElement, this.ref.nativeElement);
  }
}
