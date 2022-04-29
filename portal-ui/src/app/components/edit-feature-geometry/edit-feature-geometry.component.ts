import { Component, Input, ElementRef, OnDestroy, OnChanges, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { EditFeatureGeometryStore } from '../../stores/EditFeatureGeometry.store';
import { registry } from '../../services/registry';
import { EditFeatureGeometry } from '../EditFeatureGeometry/EditFeatureGeometry';
import { createRoot, Root } from 'react-dom/client';

@Component({
  selector: 'crg-edit-feature-geometry',
  template: '<div class="edit-feature-geometry" #react></div>',
  styleUrls: ['./edit-feature-geometry.component.scss']
})
export class EditFeatureGeometryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() store: EditFeatureGeometryStore;
  @Input() readOnly: boolean;
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;
  private root: Root;

  ngOnInit() {
    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(withRegistry(registry)(EditFeatureGeometry), {
      store: this.store,
      readOnly: this.readOnly
    });

    this.root?.render(reactElement);
  }
}
