import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { LibraryDocumentPageContainer } from '../LibraryDocumentPageContainer/LibraryDocumentPageContainer';

const LibraryDocumentPageContainerWithRegistry = withRegistry(registry)(LibraryDocumentPageContainer);

@Component({
  selector: 'crg-library-document-page-container',
  template: '<div class="library-document-page-container" #react></div>',
  styleUrls: ['./library-document-page-container.component.scss']
})
export class LibraryDocumentPageContainerComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(LibraryDocumentPageContainerWithRegistry);

    this.root?.render(reactElement);
  }
}
