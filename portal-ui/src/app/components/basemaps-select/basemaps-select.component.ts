import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { BasemapsSelect } from '../BasemapsSelect/BasemapsSelect';
import { registry } from '../../services/registry';

@Component({
  selector: 'crg-basemaps-select',
  template: '<div class="basemaps-select" #react></div>',
  styleUrls: ['./basemaps-select.component.scss']
})
export class BasemapsSelectComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(withRegistry(registry)(BasemapsSelect));

    render(reactElement, this.ref.nativeElement);
  }
}
