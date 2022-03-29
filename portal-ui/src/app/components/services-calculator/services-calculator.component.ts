import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { createElement } from 'react';
import { withRegistry } from '@bem-react/di';

import { ServicesCalculator } from '../ServicesCalculator/ServicesCalculator';
import { registry } from '../../services/registry';

@Component({
  selector: 'crg-services-calculator',
  template: '<div class="services-calculator" #react></div>',
  styleUrls: ['./services-calculator.component.scss']
})
export class ServicesCalculatorComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.renderReactElement();
  }

  ngOnDestroy(): void {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(withRegistry(registry)(ServicesCalculator));

    render(reactElement, this.ref.nativeElement);
  }
}
