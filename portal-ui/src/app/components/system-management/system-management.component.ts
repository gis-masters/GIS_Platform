import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { withRegistry } from '@bem-react/di';

import { registry } from '../../services/di-registry';
import { SystemManagement } from '../SystemManagement/SystemManagement';

const SystemManagementWithRegistry = withRegistry(registry)(SystemManagement);

@Component({
  selector: 'crg-system-management',
  template: '<div class="system-management" #react></div>',
  styleUrls: ['./system-management.component.scss']
})
export class SystemManagementComponent implements OnInit, OnChanges, OnDestroy {
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
    const reactElement = createElement(SystemManagementWithRegistry);

    this.root?.render(reactElement);
  }
}
