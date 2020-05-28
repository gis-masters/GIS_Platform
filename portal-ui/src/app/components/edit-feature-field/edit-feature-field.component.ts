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

import { EditFeatureItem, FieldType } from '../../services/crg/schema.service';
import { EditFeatureField } from '../EditFeatureField/EditFeatureField';

@Component({
  selector: 'crg-edit-feature-field',
  template: '<div class="edit-feature-field" #react></div>',
  styleUrls: ['./edit-feature-field.component.scss']
})
export class EditFeatureFieldComponent implements OnInit, OnDestroy, OnChanges {
  @Input() type: FieldType;
  @Input() field: EditFeatureItem;
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
      field: this.field
    });

    render(reactElement, this.ref.nativeElement);
  }
}
