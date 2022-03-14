import { Component, Input, ElementRef, OnDestroy, OnChanges, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { registry } from '../../services/registry';
import { EditFeatureGeometry } from '../EditFeatureGeometry/EditFeatureGeometry';

@Component({
  selector: 'crg-edit-feature-geometry',
  template: '<div class="edit-feature-geometry" #react></div>',
  styleUrls: ['./edit-feature-geometry.component.scss']
})
export class EditFeatureGeometryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() store: EditFeatureGeometryStore;
  @Input() readOnly: boolean;
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
    const reactElement = createElement(withRegistry(registry)(EditFeatureGeometry), {
      store: this.store,
      readOnly: this.readOnly
    });
    render(reactElement, this.ref.nativeElement);
  }
}
