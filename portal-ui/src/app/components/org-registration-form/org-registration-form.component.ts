import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { OrgRegistrationForm } from '../../components/OrgRegistrationForm/OrgRegistrationForm';
import { registry } from '../../services/di-registry';

const RegisterComponentWithRegistry = withRegistry(registry)(OrgRegistrationForm);

@Component({
  selector: 'crg-org-registration-form',
  template: '<div class="org-registration-form" #react></div>',
  styleUrls: ['./org-registration-form.component.scss']
})
export class OrgRegistrationFormComponent implements OnInit, OnDestroy, OnChanges {
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
    this.root?.render(createElement(RegisterComponentWithRegistry));
  }
}
