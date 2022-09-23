import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { EditedField, ValueType } from '../../services/data/schemaOld.models';
import { EditFeatureField } from '../EditFeatureField/EditFeatureField';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { CrgVectorLayer } from '../../services/gis/projects.models';
import { registry } from '../../services/di-registry';
import { createRoot, Root } from 'react-dom/client';

const EditFeatureFieldWithRegistry = withRegistry(registry)(EditFeatureField);

@Component({
  selector: 'crg-edit-feature-field',
  template: '<div class="edit-feature-field" #react></div>',
  styleUrls: ['./edit-feature-field.component.scss']
})
export class EditFeatureFieldComponent implements OnInit, OnDestroy, OnChanges {
  @Input() type: ValueType;
  @Input() field: EditedField;
  @Input() feature: WfsFeature;
  @Input() isNew: boolean;
  @Input() isReadOnly: boolean;
  @Input() layer?: CrgVectorLayer;
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
    const reactElement = createElement(EditFeatureFieldWithRegistry, {
      type: this.type,
      field: this.field,
      featureInfo: {
        feature: this.feature,
        isNew: this.isNew,
        layerName: this.layer ? this.layer.tableName : '',
        isReadOnly: Boolean(this.isReadOnly)
      }
    });

    this.root?.render(reactElement);
  }
}
