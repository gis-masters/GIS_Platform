import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { convertOldToNewProperties } from '../../services/data/schema/schema.utils';
import { OldPropertySchema } from '../../services/data/schema/schemaOld.models';
import { registry } from '../../services/di-registry';
import { FormDescription } from '../Form/Description/Form-Description';

const FormDescriptionWithRegistry = withRegistry(registry)(FormDescription);

@Component({
  selector: 'crg-form-description',
  template: '<div class="form-description" #react></div>',
  styleUrls: ['./form-description.component.scss']
})
export class FormDescriptionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() property?: OldPropertySchema;
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;
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
    const reactElement = createElement(FormDescriptionWithRegistry, { children: convertedProperty.description });

    this.root?.render(reactElement);
  }
}
