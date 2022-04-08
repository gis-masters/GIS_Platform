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
import { withRegistry } from '@bem-react/di';
import { render, unmountComponentAtNode } from 'react-dom';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { boundMethod } from 'autobind-decorator';

import { OldPropertySchema } from '../../services/crg/schemaOld.models';
import { FormControl } from '../Form/Control/Form-Control.composed';
import { convertSchema } from '../../services/crg/schema.utils';
import { PropertyType } from '../../services/crg/schema.models';
import { FormView } from '../Form/View/Form-View.composed';
import { FormDialog } from '../FormDialog/FormDialog';
import { registry } from '../../services/registry';
import { Form } from '../Form/Form';

@Component({
  selector: 'crg-form-control',
  template: '<div class="form-control" #react></div>',
  styleUrls: ['./form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FormControlComponent)
    }
  ]
})
export class FormControlComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
  @Input() property?: OldPropertySchema;
  @Output() inputModelChange = new EventEmitter<string>();
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

  private onChange: (value: unknown) => void;

  private value: unknown;

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
    const [convertedProperty] = convertSchema([this.property]);

    let value = this.value;
    if (typeof this.value === 'string' && convertedProperty.propertyType === PropertyType.FILE) {
      value = JSON.parse(this.value);
    }

    const reactElement = createElement(withRegistry(registry)(convertedProperty.readOnly ? FormView : FormControl), {
      property: convertedProperty,
      type: convertedProperty.propertyType,
      fieldValue: value,
      Form: Form,
      FormDialog: FormDialog,
      variant: 'outlined',
      onChange: this.handleChange,
      fullWidthForOldForm: true
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
    this.value = value;
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
