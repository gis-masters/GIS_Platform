import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/di-registry';
import { UtilityDialogsRoot } from '../UtilityDialogsRoot/UtilityDialogsRoot';

const UtilityDialogsRootWithRegistry = withRegistry(registry)(UtilityDialogsRoot);

@Component({
  selector: 'crg-utility-dialogs-root',
  template: '<div class="utility-dialogs-root" #react></div>',
  styleUrls: ['./utility-dialogs-root.component.scss']
})
export class UtilityDialogsRootComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;
  private root: Root;

  ngOnInit() {
    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(UtilityDialogsRootWithRegistry);

    this.root?.render(reactElement);
  }
}
