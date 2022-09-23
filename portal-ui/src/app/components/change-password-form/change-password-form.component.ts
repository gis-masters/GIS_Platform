import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { ChangePasswordForm } from '../ChangePasswordForm/ChangePasswordForm';
import { registry } from '../../services/di-registry';

const ChangePasswordFormWithRegistry = withRegistry(registry)(ChangePasswordForm);

@Component({
  selector: 'crg-change-password-form',
  template: '<div class="change-password-form" #react></div>',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;
  private root: Root;

  ngOnInit() {
    this.root = createRoot(this.ref.nativeElement);
    this.renderReactElement();
  }

  ngOnDestroy(): void {
    this.root.unmount();
  }

  ngOnChanges() {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(ChangePasswordFormWithRegistry);

    this.root?.render(reactElement);
  }
}
