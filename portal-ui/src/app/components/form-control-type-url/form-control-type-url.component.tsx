import { createElement } from 'react';
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  forwardRef,
  EventEmitter,
  Output
} from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { boundMethod } from 'autobind-decorator';

import { EditedField, OldPropertySchema } from '../../services/crg/schemaOld.models';
import { FormControl } from '../Form/Control/Form-Control.composed';
import { FormView } from '../Form/View/Form-View.composed';
import { convertSchema } from '../../services/crg/schema.utils';
import { PropertyType } from '../../services/crg/schema.models';
import { FormDialog } from '../FormDialog/FormDialog';
import { Form } from '../Form/Form';

@Component({
  selector: 'crg-form-control-type-url',
  template: '<div class="form-control-type-url" #react></div>',
  styleUrls: ['./form-control-type-url.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FormControlTypeUrlComponent)
    }
  ]
})
export class FormControlTypeUrlComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
  @Input() property?: OldPropertySchema;
  @Input() field: EditedField;
  @Output() inputModelChange = new EventEmitter<string>();
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

  private onChange: (value: unknown) => void;

  private value: unknown = {};

  public editFeatureForm: FormGroup;

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
    const convertedProperty = convertSchema([this.property])[0];

    const reactElement = createElement(convertedProperty.readOnly ? FormView : FormControl, {
      property: convertedProperty,
      type: PropertyType.URL,
      fieldValue: this.field.value,
      Form: Form,
      FormDialog: FormDialog,
      variant: 'outlined',
      onChange: this.handleChange
    });

    render(reactElement, this.ref.nativeElement);
  }

  @boundMethod
  private handleChange({ value }: { value: unknown }) {
    this.field.value = value as string;

    if (this.onChange) {
      this.onChange(value);
    }

    this.writeValue(value);
  }

  writeValue(value: unknown): void {
    this.value = value || {};
    this.renderReactElement();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
    this.renderReactElement();
  }

  registerOnTouched(): void {
    // void
  }
}
