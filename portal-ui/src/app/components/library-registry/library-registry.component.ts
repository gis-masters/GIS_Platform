import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { route } from '../../stores/Route.store';
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
    const libraryId = route.params.libraryId;
    const reactElement = createElement(withRegistry(registry)(LibraryRegistry), {
      libraryId,
      id: 'registryPage',
      urlChangeEnabled: true
    });

    this.root?.render(reactElement);
  }
}
