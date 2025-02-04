import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { route } from '../../stores/Route.store';
import { LibraryRegistry } from '../LibraryRegistry/LibraryRegistry';

const LibraryRegistryWithRegistry = withRegistry(registry)(LibraryRegistry);

@Component({
  selector: 'crg-library-registry',
  template: '<div class="library-registry" #react></div>',
  styleUrls: ['./library-registry.component.scss']
})
export class LibraryRegistryComponent implements OnInit, OnChanges, OnDestroy {
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
    const libraryTableName = route.params.libraryTableName;
    const reactElement = createElement(LibraryRegistryWithRegistry, {
      libraryTableName,
      id: 'registryPage',
      urlChangeEnabled: true
    });

    this.root?.render(reactElement);
  }
}
