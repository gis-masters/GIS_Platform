import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { EditedField, ValueType } from '../../services/crg/schemaOld.models';
import { EditFeatureField } from '../EditFeatureField/EditFeatureField';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { CrgVectorLayer } from '../../services/crg/projects.models';
import { registry } from '../../services/registry';

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
    const reactElement = createElement(withRegistry(registry)(EditFeatureField), {
      type: this.type,
      field: this.field,
      featureInfo: {
        feature: this.feature,
        isNew: this.isNew,
        layerName: this.layer ? this.layer.tableName : '',
        isReadOnly: Boolean(this.isReadOnly)
      }
    });

    render(reactElement, this.ref.nativeElement);
  }
}
