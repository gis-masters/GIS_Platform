import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { createElement } from 'react';

import { DataManagement } from '../DataManagement/DataManagement';

@Component({
  selector: 'crg-data-management',
  template: '<div class="data-management" #react></div>',
  styleUrls: ['./data-management.component.scss']
})
export class DataManagementComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(DataManagement);

    render(reactElement, this.ref.nativeElement);
  }
}
