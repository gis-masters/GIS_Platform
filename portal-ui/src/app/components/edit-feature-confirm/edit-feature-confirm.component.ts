import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { EditFeatureConfirm } from '../EditFeatureConfirm/EditFeatureConfirm';

@Component({
  selector: 'crg-edit-feature-confirm',
  template: '<div class="edit-feature-confirm" #react></div>',
  styleUrls: ['./edit-feature-confirm.component.scss']
})
export class EditFeatureConfirmComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(withRegistry(registry)(EditFeatureConfirm));

    render(reactElement, this.ref.nativeElement);
  }
}
