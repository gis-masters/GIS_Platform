import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { createElement } from 'react';

import { Logo } from '../Logo/Logo';

@Component({
  selector: 'crg-logo',
  template: '<div class="logo" #react></div>',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(Logo);

    render(reactElement, this.ref.nativeElement);
  }
}
