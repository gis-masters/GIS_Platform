import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Component, ElementRef, type OnChanges, type OnDestroy, type OnInit, ViewChild } from '@angular/core';

import { GlobalLoading } from '../GlobalLoading/GlobalLoading';

@Component({
  selector: 'crg-global-loading-root',
  template: '<div class="global-loading-root" #react></div>',
  styleUrls: ['./global-loading-root.component.scss'],
  standalone: false
})
export class GlobalLoadingRootComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngOnInit() {
    if (!this.ref) {
      throw new Error('Ошибка: не найден root для react компонента');
    }

    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root?.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    this.root?.render(createElement(GlobalLoading));
  }
}
