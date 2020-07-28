import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { EditedField, FieldType } from '../../services/crg/schema.service';
import { EditFeatureField, EditFeatureInfo } from '../EditFeatureField/EditFeatureField';
import { EditFeatureData } from '../edit-feature/edit-feature.component';
import { CrgLayer } from '../../services/crg/projects.models';

@Component({
  selector: 'crg-edit-feature-field',
  template: '<div class="edit-feature-field" #react></div>',
  styleUrls: ['./edit-feature-field.component.scss']
})
export class EditFeatureFieldComponent implements OnInit, OnDestroy, OnChanges {
  @Input() type: FieldType;
  @Input() field: EditedField;
  @Input() featureData?: EditFeatureData;
  @Input() isReadOnly: CrgLayer;
  @Input() layer?: CrgLayer;
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

  ngOnInit () {
    this.renderReactElement();
  }

  ngOnDestroy () {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges () {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(EditFeatureField, {
      type: this.type,
      field: this.field,
      featureInfo: {
        feature: this.featureData ? this.featureData.features[0] : null,
        isNew: this.featureData ? this.featureData.isNew : false,
        layerName: this.layer ? this.layer.internalName : '',
        isReadOnly: !!this.isReadOnly
      }
    });

    render(reactElement, this.ref.nativeElement);
  }
}
