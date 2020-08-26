import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { EditFeatureConfirm } from '../EditFeatureConfirm/EditFeatureConfirm';

@Component({
  selector: 'crg-edit-feature-confirm',
  template: '<div class="edit-feature-confirm" #react></div>',
  styleUrls: ['./edit-feature-confirm.component.scss']
})
export class EditFeatureConfirmComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(EditFeatureConfirm, {});

    render(reactElement, this.ref.nativeElement);
  }
}
