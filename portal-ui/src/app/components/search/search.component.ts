import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { Search } from '../Search/Search';

@Component({
  selector: 'crg-search',
  template: '<div class="search" #react></div>',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy, OnChanges {
  @Input() hidden: boolean;
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
    const reactElement = createElement(Search);

    render(reactElement, this.ref.nativeElement);
  }
}
