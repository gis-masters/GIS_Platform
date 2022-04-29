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
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { boundMethod } from 'autobind-decorator';

import { OldPropertySchema } from '../../services/crg/schemaOld.models';
import { FormControl } from '../Form/Control/Form-Control.composed';
import { convertProperties } from '../../services/crg/schema.utils';
import { PropertyType } from '../../services/crg/schema.models';
import { FormView } from '../Form/View/Form-View.composed';
import { registry } from '../../services/registry';
import { FormControlProps } from '../Form/Control/Form-Control';

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
    const [convertedProperty] = convertProperties([this.property]);

    let value = this.value;
    if (typeof this.value === 'string' && convertedProperty.propertyType === PropertyType.FILE) {
      value = JSON.parse(this.value);
    }

    const reactElement = createElement(
      withRegistry(registry)<FormControlProps>(
        (convertedProperty.readOnly ? FormView : FormControl) as ComponentType<FormControlProps>
      ),
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
    this.renderReactElement();
  }

  registerOnTouched(): void {
    // void
  }
}
