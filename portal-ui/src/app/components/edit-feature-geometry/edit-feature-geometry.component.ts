import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { EditFeatureGeometry } from '../EditFeatureGeometry/EditFeatureGeometry';

const EditFeatureGeometryWithRegistry = withRegistry(registry)(EditFeatureGeometry);

@Component({
  selector: 'crg-edit-feature-geometry',
  template: '<div class="edit-feature-geometry" #react></div>',
  styleUrls: ['./edit-feature-geometry.component.scss']
})
export class EditFeatureGeometryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() readOnly?: boolean;
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngOnInit() {
    if (!this.ref) {
      throw new Error('Ошибка: не найден root для react компонента');
    }

    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy() {
    this.root?.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    if (!editFeatureStore) {
      return;
    }

    const reactElement = createElement(EditFeatureGeometryWithRegistry, {
      readOnly: Boolean(this.readOnly)
    });

    this.root?.render(reactElement);
  }
}
