import { ComponentType, createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormGroup } from '@angular/forms';
import { withRegistry } from '@bem-react/di';
import { boundMethod } from 'autobind-decorator';

import { PropertyType } from '../../services/data/schema/schema.models';
import { convertOldToNewProperties } from '../../services/data/schema/schema.utils';
import { OldPropertySchema } from '../../services/data/schema/schemaOld.models';
import { registry } from '../../services/di-registry';
import { FormControlProps } from '../Form/Control/Form-Control';
import { FormControl } from '../Form/Control/Form-Control.composed';
import { FormView } from '../Form/View/Form-View.composed';

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
  // eslint-disable-next-line unicorn/prefer-event-target
  @Output() inputModelChange = new EventEmitter<string>();
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;

  private onChange?: (value: unknown) => void;
  private value: unknown;
  editFeatureForm?: UntypedFormGroup;
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
    if (!this.property) {
      return;
    }

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
        formRole: 'viewDocument',
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
