import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { LibraryRegistry } from '../LibraryRegistry/LibraryRegistry';

@Component({
  selector: 'crg-library-registry',
  template: '<div class="library-registry" #react></div>',
  styleUrls: ['./library-registry.component.scss']
})
export class LibraryRegistryComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(withRegistry(registry)(LibraryRegistry));

    this.root?.render(reactElement);
  }
}
