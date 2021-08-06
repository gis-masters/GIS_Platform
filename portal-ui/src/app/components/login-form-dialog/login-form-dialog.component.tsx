import { Component, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { LoginFormDialog } from '../LoginFormDialog/LoginFormDialog';

@Component({
  selector: 'crg-login-form-dialog',
  template: '<div class="login-form-dialog" #react></div>',
  styleUrls: ['./login-form-dialog.component.scss']
})
export class LoginFormDialogComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

  ngOnInit() {
    this.renderReactElement();
  }

  ngOnDestroy() {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(LoginFormDialog, {});

    render(reactElement, this.ref.nativeElement);
  }
}
