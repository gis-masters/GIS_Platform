import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Component, ElementRef, type OnChanges, type OnDestroy, type OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { UtilityDialogsRoot } from '../UtilityDialogsRoot/UtilityDialogsRoot';

const UtilityDialogsRootWithRegistry = withRegistry(registry)(UtilityDialogsRoot);

@Component({
  selector: 'crg-utility-dialogs-root',
  template: '<div class="utility-dialogs-root" #react></div>',
  styleUrls: ['./utility-dialogs-root.component.scss'],
  standalone: false
})
export class UtilityDialogsRootComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(UtilityDialogsRootWithRegistry);

    this.root?.render(reactElement);
  }
}
