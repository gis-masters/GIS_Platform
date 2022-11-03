import { ComponentType, createElement } from 'react';
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
import { createRoot, Root } from 'react-dom/client';
import { ControlValueAccessor, UntypedFormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { boundMethod } from 'autobind-decorator';

import { OldPropertySchema } from '../../services/data/schemaOld.models';
import { FormControl } from '../Form/Control/Form-Control.composed';
import { convertOldToNewProperties } from '../../services/data/schema.utils';
import { PropertyType } from '../../services/data/schema.models';
import { FormView } from '../Form/View/Form-View.composed';
import { registry } from '../../services/di-registry';
import { FormControlProps } from '../Form/Control/Form-Control';

const FormControlWithRegistry = withRegistry(registry)(FormControl);
const FormViewWithRegistry = withRegistry(registry)(FormView);

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
  @Input() updatingAllowed?: boolean;
  @Output() inputModelChange = new EventEmitter<string>();
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

  private onChange: (value: unknown) => void;
  private value: unknown;
  editFeatureForm: UntypedFormGroup;
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
    const [convertedProperty] = convertOldToNewProperties([this.property]);
    let value = this.value;
    if (typeof this.value === 'string' && convertedProperty.propertyType === PropertyType.FILE) {
      value = JSON.parse(this.value);
    }

    let updatingAllowed = this.updatingAllowed;

    if (updatingAllowed) {
      updatingAllowed = !convertedProperty.readOnly;
    }

    const reactElement = createElement(
      (updatingAllowed ? FormControlWithRegistry : FormViewWithRegistry) as ComponentType<FormControlProps>,
      {
        property: convertedProperty,
        type: convertedProperty.propertyType,
        fieldValue: value,
        variant: 'outlined',
        onChange: this.handleChange,
        fullWidthForOldForm: true
      }
    );

    this.root?.render(reactElement);
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
  }

  registerOnTouched(): void {
    // void
  }
}
