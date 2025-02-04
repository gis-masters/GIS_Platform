import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { EditFeatureNavigation } from '../EditFeatureNavigation/EditFeatureNavigation';

const EditFeatureNavigationWithRegistry = withRegistry(registry)(EditFeatureNavigation);

@Component({
  selector: 'crg-edit-feature-navigation',
  template: '<div class="edit-feature-navigation" #react></div>',
  styleUrls: ['./edit-feature-navigation.component.scss']
})
export class EditFeatureNavigationComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(EditFeatureNavigationWithRegistry);

    this.root?.render(reactElement);
  }
}
