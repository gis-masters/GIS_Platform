import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
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
    const reactElement = createElement(withRegistry(registry)(LibraryRegistry));

    render(reactElement, this.ref.nativeElement);
  }
}
