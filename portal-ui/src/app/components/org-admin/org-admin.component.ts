import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { OrgAdmin } from '../OrgAdmin/OrgAdmin';

const OrgAdminWithRegistry = withRegistry(registry)(OrgAdmin);

@Component({
  selector: 'crg-org-admin',
  template: '<div class="org-admin" #react></div>',
  styleUrls: ['./org-admin.component.scss']
})
export class OrgAdminComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(OrgAdminWithRegistry);

    this.root?.render(reactElement);
  }
}
