import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { EditFeatureActions } from '../EditFeatureActions/EditFeatureActions';

const EditFeatureActionsWithRegistry = withRegistry(registry)(EditFeatureActions);

@Component({
  selector: 'crg-edit-feature-actions',
  template: '<div class="edit-feature-actions" #react></div>',
  styleUrls: ['./edit-feature-actions.component.scss']
})
export class EditFeatureActionsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() feature?: WfsFeature;
  @Input() layer?: CrgVectorLayer;
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
    if (!this.feature || !this.layer) {
      return;
    }

    const reactElement = createElement(EditFeatureActionsWithRegistry, {
      feature: this.feature,
      layer: this.layer
    });

    this.root?.render(reactElement);
  }
}
