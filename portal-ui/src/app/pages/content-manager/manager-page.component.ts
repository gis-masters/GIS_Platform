import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { createElement } from 'react';
import { ContentManager } from '../../components/Manager/Manager.async';

@Component({
  selector: 'crg-manager-page',
  template: '<div class="manager-page" #react></div>',
})
export class ManagerPageComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

  ngOnInit() {
    this.renderReactElement();
  }

  ngOnDestroy(): void {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(ContentManager);

    render(reactElement, this.ref.nativeElement);
  }
}
