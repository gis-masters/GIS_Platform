import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { EditedField, ValueType } from '../../services/data/schema/schemaOld.models';
import { registry } from '../../services/di-registry';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { EditFeatureField } from '../EditFeatureField/EditFeatureField';

const EditFeatureFieldWithRegistry = withRegistry(registry)(EditFeatureField);

@Component({
  selector: 'crg-edit-feature-field',
  template: '<div class="edit-feature-field" #react></div>',
  styleUrls: ['./edit-feature-field.component.scss']
})
export class EditFeatureFieldComponent implements OnInit, OnDestroy, OnChanges {
  @Input() type?: ValueType;
  @Input() field?: EditedField;
  @Input() feature?: WfsFeature;
  @Input() isNew?: boolean;
  @Input() isReadOnly?: boolean;
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
    if (!this.type || !this.field || !this.feature) {
      return;
    }

    const reactElement = createElement(EditFeatureFieldWithRegistry, {
      type: this.type,
      field: this.field,
      featureInfo: {
        feature: this.feature,
        layerName: this.layer ? this.layer.tableName : '',
        isReadOnly: Boolean(this.isReadOnly)
      }
    });

    this.root?.render(reactElement);
  }
}
