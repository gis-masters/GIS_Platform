import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { ReValidateButton } from '../ReValidateButton/ReValidateButton';

@Component({
  selector: 're-validate-button',
  template: '<div #react></div>'
})
export class ReValidateButtonComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(ReValidateButton);

    render(reactElement, this.ref.nativeElement);
  }
}
