import { Component, Input, ElementRef, OnDestroy, OnChanges, OnInit, ViewChild } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { EditFeatureGeometry } from '../EditFeatureGeometry/EditFeatureGeometry';

@Component({
  selector: 'crg-edit-feature-geometry',
  template: '<div class="edit-feature-geometry" #react></div>',
  styleUrls: ['./edit-feature-geometry.component.scss']
})
export class EditFeatureGeometryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() store: EditFeatureGeometryStore;
  @Input() readOnly: boolean;
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
    const reactElement = createElement(EditFeatureGeometry, { store: this.store, readOnly: this.readOnly });
    render(reactElement, this.ref.nativeElement);
  }
}
