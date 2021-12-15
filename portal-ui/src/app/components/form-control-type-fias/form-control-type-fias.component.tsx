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
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { render, unmountComponentAtNode } from 'react-dom';
import { boundMethod } from 'autobind-decorator';

import { PropertySchema, PropertyType } from '../../services/crg/schema.models';
import { FormControl } from '../Form/Control/Form-Control.composed';

@Component({
  selector: 'crg-form-control-type-fias',
  template: '<div class="form-control-type-fias" #react></div>',
  styleUrls: ['./form-control-type-fias.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FormControlTypeFiasComponent)
    }
  ]
})
export class FormControlTypeFiasComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
  @Input() property?: PropertySchema;
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
    const reactElement = createElement(FormControl, {
      property: this.property,
      type: PropertyType.FIAS,
      fieldValue: this.value,
      variant: 'outlined',
      inSet: true,
      onChange: this.handleChange
    });

    render(reactElement, this.ref.nativeElement);
  }

  @boundMethod
  private handleChange({ value }: { value: unknown }) {
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
