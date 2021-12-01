import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { createElement } from 'react';

import { LibraryDocument } from '../LibraryDocument/LibraryDocument';

@Component({
  selector: 'crg-library-document',
  template: '<div class="library-document" #react></div>',
  styleUrls: ['./library-document.component.scss']
})
export class LibraryDocumentComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

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
    const reactElement = createElement(LibraryDocument);

    render(reactElement, this.ref.nativeElement);
  }
}
