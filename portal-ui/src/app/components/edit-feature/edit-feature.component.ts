import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Component, ElementRef, type OnChanges, type OnDestroy, type OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { EditFeature } from '../EditFeature/EditFeature';

const EditFeatureBoxWithRegistry = withRegistry(registry)(EditFeature);

@Component({
  selector: 'crg-edit-feature',
  template: '<div class="edit-feature" #react></div>',
  standalone: false
})
export class EditFeatureBoxComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(EditFeatureBoxWithRegistry);

    this.root?.render(reactElement);
  }
}
