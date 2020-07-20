import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { OrgAdminButton } from '../OrgAdminButton/OrgAdminButton';

@Component({
  selector: 'crg-org-admin-button',
  template: '<div class="org-admin-button" #react></div>',
  styleUrls: ['./org-admin-button.component.scss']
})
export class OrgAdminButtonComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef;

  ngOnInit () {
    this.renderReactElement();
  }

  ngOnDestroy () {
    unmountComponentAtNode(this.ref.nativeElement);
  }

  ngOnChanges () {
    this.renderReactElement();
  }

  private renderReactElement() {
    const reactElement = createElement(OrgAdminButton);

    render(reactElement, this.ref.nativeElement);
  }
}
