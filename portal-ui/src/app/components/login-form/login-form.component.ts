import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/di-registry';
import { LoginForm } from '../LoginForm/LoginForm';
import { createRoot, Root } from 'react-dom/client';

const LoginFormWithRegistry = withRegistry(registry)(LoginForm);

@Component({
  selector: 'crg-login-form',
  template: '<div class="login-form" #react></div>',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(LoginFormWithRegistry);

    this.root?.render(reactElement);
  }
}
