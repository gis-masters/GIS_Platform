import { Component, OnInit, OnDestroy, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { Footer } from '../Footer/Footer';

@Component({
  selector: 'crg-footer',
  template: '<div class="fooret" #react></div>'
})
export class FooterComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(Footer);

    render(reactElement, this.ref.nativeElement);
  }
}
