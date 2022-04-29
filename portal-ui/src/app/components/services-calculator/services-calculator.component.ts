import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { ServicesCalculator } from '../ServicesCalculator/ServicesCalculator';
import { registry } from '../../services/registry';

@Component({
  selector: 'crg-services-calculator',
  template: '<div class="services-calculator" #react></div>',
  styleUrls: ['./services-calculator.component.scss']
})
export class ServicesCalculatorComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;
  private root: Root;

  ngOnInit() {
    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy(): void {
    this.root.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(withRegistry(registry)(ServicesCalculator));

    this.root?.render(reactElement);
  }
}
