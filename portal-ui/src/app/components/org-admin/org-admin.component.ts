import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { render, unmountComponentAtNode } from 'react-dom';
import { withRegistry } from '@bem-react/di';
import { createElement } from 'react';

import { registry } from '../../services/registry';
import { OrgAdmin } from '../OrgAdmin/OrgAdmin';

@Component({
  selector: 'crg-org-admin',
  template: '<div class="org-admin" #react></div>',
  styleUrls: ['./org-admin.component.scss']
})
export class OrgAdminComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('react', { read: ElementRef, static: true }) ref: ElementRef<HTMLDivElement>;

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
    const reactElement = createElement(withRegistry(registry)(OrgAdmin));

    render(reactElement, this.ref.nativeElement);
  }
}
