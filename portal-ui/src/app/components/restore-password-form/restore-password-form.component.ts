import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { RestorePasswordForm } from '../RestorePasswordForm/RestorePasswordForm';

const RestorePasswordFormWithRegistry = withRegistry(registry)(RestorePasswordForm);

@Component({
  selector: 'crg-restore-password-form',
  template: '<div class="restore-password-form" #react></div>',
  styleUrls: ['./restore-password-form.component.scss']
})
export class RestorePasswordFormComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref?: ElementRef<HTMLDivElement>;
  private root?: Root;

  ngOnInit() {
    if (!this.ref) {
      throw new Error('Ошибка: не найден root для react компонента');
    }

    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy(): void {
    this.root?.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(RestorePasswordFormWithRegistry);

    this.root?.render(reactElement);
  }
}
