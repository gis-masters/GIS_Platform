import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { FormDescription } from '../Form/Description/Form-Description';
import { OldPropertySchema } from '../../services/crg/schemaOld.models';
import { convertProperties } from '../../services/crg/schema.utils';

const FormDescriptionWithRegistry = withRegistry(registry)(FormDescription);

@Component({
  selector: 'crg-form-description',
  template: '<div class="form-description" #react></div>',
  styleUrls: ['./form-description.component.scss']
})
export class FormDescriptionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() property?: OldPropertySchema;
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
    const [convertedProperty] = convertProperties([this.property]);
    const reactElement = createElement(FormDescriptionWithRegistry, { children: convertedProperty.description });

    this.root?.render(reactElement);
  }
}
