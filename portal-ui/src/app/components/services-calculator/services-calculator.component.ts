import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { ServicesCalculator } from '../ServicesCalculator/ServicesCalculator';

const ServicesCalculatorWithRegistry = withRegistry(registry)(ServicesCalculator);

@Component({
  selector: 'crg-services-calculator',
  template: '<div class="services-calculator" #react></div>',
  styleUrls: ['./services-calculator.component.scss']
})
export class ServicesCalculatorComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngOnInit() {
    if (!this.ref) {
      throw new Error('Ошибка: не найден root для react компонента');
    }

    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy(): void {
    this.root?.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(ServicesCalculatorWithRegistry);

    this.root?.render(reactElement);
  }
}
