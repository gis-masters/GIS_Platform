import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { LibraryDocumentPageContainer } from '../LibraryDocumentPageContainer/LibraryDocumentPageContainer';

@Component({
  selector: 'crg-library-document-page-container',
  template: '<div class="library-document-page-container" #react></div>',
  styleUrls: ['./library-document-page-container.component.scss']
})
export class LibraryDocumentPageContainerComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.renderReactElement();
  }

  ngOnDestroy() {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(withRegistry(registry)(LibraryDocumentPageContainer));

    render(reactElement, this.ref.nativeElement);
  }
}
