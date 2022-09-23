import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/di-registry';
import { LoginFormDialog } from '../LoginFormDialog/LoginFormDialog';

const LoginFormDialogWithRegistry = withRegistry(registry)(LoginFormDialog);

@Component({
  selector: 'crg-login-form-dialog',
  template: '<div class="login-form-dialog" #react></div>',
  styleUrls: ['./login-form-dialog.component.scss']
})
export class LoginFormDialogComponent implements OnInit, OnDestroy, OnChanges {
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
    const reactElement = createElement(LoginFormDialogWithRegistry);

    this.root?.render(reactElement);
  }
}
